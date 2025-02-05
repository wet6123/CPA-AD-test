// src/app/admin/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // 통계 데이터 가져오기
  const { data: stats } = await supabase
    .from("promotions")
    .select("status", { count: "exact" })
    .eq("status", "active");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">대시보드</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500 text-sm font-medium">활성 프로모션</h2>
            <p className="mt-2 text-3xl font-bold">{stats?.length || 0}</p>
          </div>

          {/* 추가 통계 카드들 */}
        </div>

        {/* 최근 활동 목록 등 추가 컨텐츠 */}
      </div>
    </AdminLayout>
  );
}
