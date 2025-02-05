// src/app/site-b/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import PromotionCard from "@/components/PromotionCard";

export default async function SiteBHome() {
  const supabase = createServerComponentClient({ cookies });

  // 활성 상태의 최신 프로모션 가져오기
  const { data: promotions } = await supabase
    .from("promotions")
    .select(
      `
      *,
      category:categories(name)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(12);

  // 카테고리별로 프로모션 그룹화
  const promotionsByCategory: Record<string, typeof promotions> =
    promotions?.reduce((acc, promotion) => {
      const categoryName = promotion.category?.name || "기타";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(promotion);
      return acc;
    }, {} as Record<string, typeof promotions>);

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <div className="bg-blue-600 -mx-4 px-4 py-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">최고의 CPA 프로모션</h2>
          <p className="text-blue-100">다양한 프로모션을 만나보세요</p>
        </div>
      </div>

      {/* 카테고리별 프로모션 섹션 */}
      {promotionsByCategory &&
        Object.entries(promotionsByCategory).map(([category, items]) => (
          <section key={category} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{category}</h2>
              <Link
                href={`/site-b/categories/${category.toLowerCase()}`}
                className="text-blue-600 hover:text-blue-800"
              >
                더 보기
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items &&
                items.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    title={promotion.title}
                    description={promotion.description}
                    commissionRate={promotion.commission_rate}
                    status={promotion.status}
                    url={promotion.url || "#"}
                    darkMode={true}
                  />
                ))}
            </div>
          </section>
        ))}

      {/* 프로모션이 없을 때 */}
      {(!promotions || promotions.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">현재 진행중인 프로모션이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
