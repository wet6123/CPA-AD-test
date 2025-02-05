import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 현재 시간을 이용해 유니크한 값 생성
    const timestamp = new Date().getTime();

    // 카테고리 테스트 데이터 삽입
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .insert([
        {
          name: `테스트 카테고리 ${timestamp}`,
          slug: `test-category-${timestamp}`,
          description: "테스트용 카테고리입니다.",
        },
      ])
      .select();

    if (categoryError) {
      throw categoryError;
    }

    // 프로모션 테스트 데이터 삽입
    const { data: promotionData, error: promotionError } = await supabase
      .from("promotions")
      .insert([
        {
          title: `테스트 프로모션 ${timestamp}`,
          description: "테스트용 프로모션입니다.",
          content: "프로모션 내용...",
          category_id: categoryData[0].id,
          status: "active",
        },
      ])
      .select();

    if (promotionError) {
      throw promotionError;
    }

    return NextResponse.json({
      success: true,
      category: categoryData,
      promotion: promotionData,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
