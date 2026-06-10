import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "省エネチェッカー | 仕様基準 適合診断",
  description:
    "建築物の省エネ基準（仕様基準）への適合を簡単にチェックできる無料オープンソースツール。2025年義務化対応。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen">

        {/* ── Animated background ── */}
        <div className="bg-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="bg-dots" aria-hidden="true" />

        {/* ── Header ── */}
        <header
          className="sticky top-0 z-50 border-b"
          style={{
            background: "rgba(238,241,255,0.7)",
            backdropFilter: "blur(20px) saturate(1.5)",
            WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            borderColor: "rgba(255,255,255,0.7)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: "0 3px 10px rgba(99,102,241,0.4)",
                }}
              >
                E
              </div>
              <span className="font-bold text-slate-800 tracking-tight text-base">省エネチェッカー</span>
              <span
                className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  color: "#4f46e5",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                2025年義務化対応
              </span>
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/KingT-rexKing/shoene-checker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-all px-3 py-1.5 rounded-xl hover:bg-white/60"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>

        {/* ── Footer ── */}
        <footer
          className="border-t mt-16"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.7)",
          }}
        >
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-slate-400 space-y-1">
            <p>本ツールの結果は参考情報です。正式な適合性判定は登録判定機関にご確認ください。</p>
            <p>MIT License | Open Source Project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
