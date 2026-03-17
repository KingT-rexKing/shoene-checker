import type { Metadata } from "next";
import "./globals.css";

// ===== 网站的元信息（浏览器标签页上显示的标题等） =====
export const metadata: Metadata = {
  title: "省エネチェッカー | 仕様基準 適合診断",
  description:
    "建築物の省エネ基準（仕様基準）への適合を簡単にチェックできる無料オープンソースツール",
};

// ===== 这是所有页面的"外壳"。page.tsx 的内容会被放在 {children} 的位置 =====
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {/* 顶部导航栏 */}
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-lg font-bold">
              ⚡ 省エネチェッカー
            </h1>
            <a
              href="https://github.com"
              target="_blank"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              GitHub →
            </a>
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>

        {/* 底部 */}
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
            <p>
              本ツールの結果は参考情報です。正式な適合性判定は登録判定機関にご確認ください。
            </p>
            <p className="mt-1">MIT License | Open Source Project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
