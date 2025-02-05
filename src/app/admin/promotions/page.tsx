// src/app/admin/promotions/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AdminLayout from "@/components/admin/AdminLayout";
import PromotionList from "./PromotionList";
import CreatePromotionButton from "./CreatePromotionButton";

export default async function PromotionsPage() {
  const supabase = createServerComponentClient({ cookies });

  // 프로모션과 카테고리 정보 함께 가져오기
  const { data: promotions } = await supabase
    .from("promotions")
    .select(
      `
      *,
      category:categories(name)
    `
    )
    .order("created_at", { ascending: false });

  // 카테고리 목록 가져오기 (셀렉트 박스용)
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">프로모션 관리</h1>
          <CreatePromotionButton />
        </div>
        <PromotionList
          initialPromotions={promotions || []}
          categories={categories || []}
        />
      </div>
    </AdminLayout>
  );
}
