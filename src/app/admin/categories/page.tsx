// src/app/admin/categories/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoryList from "./CategoryList";
import CreateCategoryButton from "./CreateCategoryButton"; // 새로 만들 컴포넌트

export default async function CategoriesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">카테고리 관리</h1>
          <CreateCategoryButton />
        </div>
        <CategoryList initialCategories={categories || []} />
      </div>
    </AdminLayout>
  );
}
