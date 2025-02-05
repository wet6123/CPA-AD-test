// src/app/site-a/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import PromotionCard from "@/components/PromotionCard";

export default async function SiteAHome() {
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

  // 카테고리 목록 가져오기
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="space-y-8">
      {/* 카테고리 네비게이션 */}
      <nav className="bg-white shadow rounded-lg p-4">
        <ul className="flex space-x-4 overflow-x-auto">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link
                href={`/site-a/categories/${category.slug}`}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md whitespace-nowrap"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 프로모션 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions?.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            title={promotion.title}
            description={promotion.description}
            commissionRate={promotion.commission_rate}
            status={promotion.status}
            url={promotion.url || "#"}
          />
        ))}
      </div>

      {/* 프로모션이 없을 때 */}
      {(!promotions || promotions.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">현재 진행중인 프로모션이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
