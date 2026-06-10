"use client";

import { useState } from "react";

interface Material {
  name: string;
  lambda: number;
  note?: string;
}

const WALL_MATERIALS: Material[] = [
  { name: "グラスウール 16K",    lambda: 0.045, note: "最も一般的" },
  { name: "高性能 GW 16K",       lambda: 0.038 },
  { name: "高性能 GW 24K",       lambda: 0.036 },
  { name: "高性能 GW 32K",       lambda: 0.035 },
  { name: "吹付ウレタン A種1H",  lambda: 0.026, note: "現場吹付け" },
  { name: "ロックウール 40K",    lambda: 0.038 },
  { name: "セルロースF",         lambda: 0.040 },
];

const FLOOR_MATERIALS: Material[] = [
  { name: "押出法PS 3種（XPS）", lambda: 0.028, note: "床断熱に多用" },
  { name: "硬質ウレタン 2種",    lambda: 0.024 },
  { name: "高性能 GW 16K",       lambda: 0.038 },
];

const WALL_THICKNESSES  = [50, 75, 100, 105, 120, 140, 155, 185, 210, 240];
const FLOOR_THICKNESSES = [20, 25, 30,  40,  50,  60,  65,  75,  95,  100];

function calcR(mm: number, lambda: number) {
  return (mm / (lambda * 1000)).toFixed(2);
}

// Color-code R value cells based on common requirements
function getRValueColor(r: number): string {
  if (r >= 4.6) return "text-emerald-700 font-semibold bg-emerald-50";
  if (r >= 3.3) return "text-teal-700 bg-teal-50";
  if (r >= 2.2) return "text-blue-700 bg-blue-50";
  return "text-slate-500";
}

function MaterialTable({ materials, thicknesses }: { materials: Material[]; thicknesses: number[] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="text-xs w-full border-collapse min-w-max">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-3 py-2 border border-slate-200 font-semibold text-slate-600 whitespace-nowrap sticky left-0 bg-slate-50 z-10 rounded-tl-lg">
              断熱材
            </th>
            <th className="px-2 py-2 border border-slate-200 font-semibold text-slate-500 whitespace-nowrap">
              λ値
            </th>
            {thicknesses.map((t) => (
              <th key={t} className="px-2 py-2 border border-slate-200 font-semibold text-center whitespace-nowrap text-slate-600">
                {t}mm
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {materials.map((mat, mi) => (
            <tr key={mat.name} className="hover:bg-blue-50/40 transition-colors">
              <td className={`px-3 py-2 border border-slate-200 whitespace-nowrap sticky left-0 z-10 ${mi % 2 === 0 ? "bg-white" : "bg-slate-50/80"}`}>
                <span className="font-medium text-slate-700">{mat.name}</span>
                {mat.note && (
                  <span className="text-slate-400 text-[10px] ml-1.5 px-1.5 py-0.5 bg-slate-100 rounded">
                    {mat.note}
                  </span>
                )}
              </td>
              <td className="px-2 py-2 border border-slate-200 text-center text-slate-500 font-mono">
                {mat.lambda}
              </td>
              {thicknesses.map((t) => {
                const r = parseFloat(calcR(t, mat.lambda));
                return (
                  <td key={t} className={`px-2 py-2 border border-slate-200 text-center font-mono tabular-nums ${getRValueColor(r)}`}>
                    {r.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InsulationRTable() {
  const [open, setOpen] = useState(false);

  return (
    <section className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-slate-700 hover:bg-white/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 text-xs">≡</span>
          断熱材 R値 速查表
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">（色: 緑=高断熱 / 青=中断熱）</span>
        </span>
        <span className={`text-slate-400 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-slate-100 animate-fade-up">
          <p className="text-xs text-slate-400 pt-4">
            R = 厚さ(mm) ÷ (λ × 1000)　単位: m²·K/W
            <span className="ml-3 inline-flex gap-3">
              <span className="text-emerald-600">■ R≥4.6</span>
              <span className="text-teal-600">■ R≥3.3</span>
              <span className="text-blue-600">■ R≥2.2</span>
            </span>
          </p>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              壁・屋根・天井（グラスウール系 / 吹付け）
            </p>
            <MaterialTable materials={WALL_MATERIALS} thicknesses={WALL_THICKNESSES} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
              床・基礎（ボード系）
            </p>
            <MaterialTable materials={FLOOR_MATERIALS} thicknesses={FLOOR_THICKNESSES} />
          </div>

          <p className="text-xs text-slate-400">
            ※ 熱伝導率はJIS A 9521準拠の代表値です。実際の製品値はメーカーカタログをご確認ください。
          </p>
        </div>
      )}
    </section>
  );
}
