// src/app/site-b/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | 사이트B",
    default: "사이트B - CPA 프로모션",
  },
  description: "사이트B의 설명",
};

export default function SiteBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이트B의 헤더 */}
      <header className="bg-blue-600 text-white">
        <nav className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">사이트B</h1>
        </nav>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* 사이트B의 푸터 */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <p>© 2024 사이트B. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
