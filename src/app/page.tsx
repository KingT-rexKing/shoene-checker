import Checker from "@/components/Checker";
import InsulationRTable from "@/components/InsulationRTable";

export default function Home() {
  return (
    <div className="space-y-8">

      {/* ── Hero ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            2025年4月 義務化対応
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            木造戸建住宅
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            全地域（1〜8）対応
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          省エネ仕様基準<br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600"> 適合診断</span>
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
          断熱材のR値・窓のU値を入力するだけで、仕様基準（簡易ルート）への適合を即座に判定。
          材料から自動計算する機能付き。複雑な計算ソフト不要です。
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 pt-1">
          {[
            { value: "3分", label: "で判定完了" },
            { value: "8地域", label: "すべて対応" },
            { value: "無料", label: "完全オープンソース" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-800">{s.value}</span>
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Checker ── */}
      <Checker />

      {/* ── Insulation R table ── */}
      <InsulationRTable />

      {/* ── Info section ── */}
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs">?</span>
            仕様基準とは
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            国が定めた断熱材・窓の仕様に従うことで、複雑な省エネ計算なしに省エネ基準への適合を確認できる簡易的な方法です。
            木造戸建住宅では最も使われる判定ルートです。
          </p>
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 text-xs">✓</span>
            このツールについて
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            MITライセンスのオープンソースです。計算ロジックは完全に透明で、
            GitHubでソースコードを確認できます。小規模工務店・個人の建築士向けに設計しています。
          </p>
        </div>
      </div>
    </div>
  );
}
