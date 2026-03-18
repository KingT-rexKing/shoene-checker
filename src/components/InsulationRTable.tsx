"use client";

// ============================================================
// InsulationRTable — よく使われる断熱材のR値速查表
// ============================================================
// 出典: 旭化成建材・アキレス断熱材カタログ値（JIS A 9521 準拠）
// R値 = 厚さ(mm) ÷ (熱伝導率 λ [W/(m·K)] × 1000)
// ============================================================

import { useState } from "react";

// ----- データ定義 -----

interface Material {
  name: string;
  lambda: number; // 熱伝導率 [W/(m·K)]
  note?: string;
}

// 壁・屋根・天井断熱材（グラスウール系など）
const WALL_MATERIALS: Material[] = [
  { name: "グラスウール 16K",    lambda: 0.045, note: "最も一般的" },
  { name: "高性能GW 16K",        lambda: 0.038 },
  { name: "高性能GW 24K",        lambda: 0.036 },
  { name: "高性能GW 32K",        lambda: 0.035 },
  { name: "吹付ウレタン A種1H",  lambda: 0.026, note: "現場吹付け" },
];

// 床・基礎断熱材（ボード系）
const FLOOR_MATERIALS: Material[] = [
  { name: "押出法PS 3種",      lambda: 0.028, note: "床断熱に多用" },
  { name: "硬質ウレタン 2種",  lambda: 0.024 },
  { name: "高性能GW 16K",      lambda: 0.038 },
];

// 各テーブルで表示する厚さ（mm）
const WALL_THICKNESSES  = [50, 75, 100, 105, 120, 140, 155, 185, 210, 240];
const FLOOR_THICKNESSES = [20, 25, 30,  40,  50,  60,  65,  75,  95,  100];

// ----- ユーティリティ -----

function calcR(mm: number, lambda: number): string {
  return (mm / (lambda * 1000)).toFixed(2);
}

// ----- サブコンポーネント -----

function MaterialTable({
  materials,
  thicknesses,
}: {
  materials: Material[];
  thicknesses: number[];
}) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="text-xs w-full border-collapse min-w-max">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-3 py-2 border border-gray-200 font-medium whitespace-nowrap sticky left-0 bg-gray-50 z-10">
              断熱材
            </th>
            <th className="px-2 py-2 border border-gray-200 font-medium text-gray-500 whitespace-nowrap">
              λ
            </th>
            {thicknesses.map((t) => (
              <th
                key={t}
                className="px-2 py-2 border border-gray-200 font-medium text-center whitespace-nowrap text-gray-700"
              >
                {t}mm
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {materials.map((mat) => (
            <tr key={mat.name} className="hover:bg-blue-50/40 transition-colors">
              <td className="px-3 py-2 border border-gray-200 whitespace-nowrap sticky left-0 bg-white z-10">
                <span className="font-medium">{mat.name}</span>
                {mat.note && (
                  <span className="text-gray-400 text-[10px] ml-1.5">
                    ({mat.note})
                  </span>
                )}
              </td>
              <td className="px-2 py-2 border border-gray-200 text-center text-gray-500 font-mono">
                {mat.lambda}
              </td>
              {thicknesses.map((t) => (
                <td
                  key={t}
                  className="px-2 py-2 border border-gray-200 text-center font-mono tabular-nums text-gray-800"
                >
                  {calcR(t, mat.lambda)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----- メインコンポーネント -----

export default function InsulationRTable() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* アコーディオンヘッダー */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>📊 断熱材のR値速查表（よく使われる断熱材）</span>
        <span className="text-gray-400 text-xs ml-2 shrink-0">
          {open ? "▲ 閉じる" : "▼ 開く"}
        </span>
      </button>

      {/* 展開コンテンツ */}
      {open && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-100">
          <p className="text-xs text-gray-500 pt-4">
            R値 = 厚さ(mm) ÷ (λ × 1000)　単位: m²·K/W。
            入力フォームの値を確認するのに使ってください。
          </p>

          {/* 壁・屋根・天井テーブル */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              壁・屋根・天井（グラスウール系 / 吹付け）
            </p>
            <MaterialTable
              materials={WALL_MATERIALS}
              thicknesses={WALL_THICKNESSES}
            />
          </div>

          {/* 床・基礎テーブル */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              床・基礎（ボード系）
            </p>
            <MaterialTable
              materials={FLOOR_MATERIALS}
              thicknesses={FLOOR_THICKNESSES}
            />
          </div>

          <p className="text-xs text-gray-400">
            ※ 熱伝導率はJIS A 9521準拠の代表値です。
            実際の製品値はメーカーカタログをご確認ください。
          </p>
        </div>
      )}
    </section>
  );
}
