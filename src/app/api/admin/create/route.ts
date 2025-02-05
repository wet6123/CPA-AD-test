import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 먼저 해당 이메일의 기존 유저를 찾아봅니다
    const { data: existingUser } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .single();

    // 이미 존재하는 경우
    if (existingUser) {
      return NextResponse.json(
        { error: "이미 존재하는 관리자입니다." },
        { status: 400 }
      );
    }

    // 관리자 계정 생성
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth Error:", authError);
      return NextResponse.json(
        { error: "계정 생성 실패", details: authError.message },
        { status: 500 }
      );
    }

    console.log("Auth Data:", authData); // 디버깅용

    // admins 테이블에 추가 정보 저장
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .insert([
        {
          id: authData.user.id,
          email: email,
          name: email.split("@")[0],
        },
      ])
      .select();

    if (adminError) {
      console.error("Admin Error:", adminError);
      // 롤백: 생성된 auth 유저 삭제
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "관리자 정보 저장 실패", details: adminError.message },
        { status: 500 }
      );
    }

    console.log("Admin Data:", adminData); // 디버깅용

    return NextResponse.json({
      success: true,
      user: authData.user,
      admin: adminData,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "서버 에러",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
