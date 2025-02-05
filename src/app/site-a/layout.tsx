// src/app/site-a/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | 사이트A",
    default: "사이트A - CPA 프로모션",
  },
  description: "사이트A의 설명",
};

export default function SiteALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 사이트A의 헤더 */}
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">사이트A</h1>
        </nav>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* 사이트A의 푸터 */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <p>© 2024 사이트A. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
