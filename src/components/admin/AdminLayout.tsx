// src/components/admin/AdminLayout.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold">CPA 관리자</h1>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            대시보드
          </Link>
          <Link
            href="/admin/categories"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            카테고리 관리
          </Link>
          <Link
            href="/admin/promotions"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            프로모션 관리
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            로그아웃
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
}
