"use client"; // ← Next.jsに「このコンポーネントはブラウザで動く」と伝えるおまじない

// ============================================================
// Checker コンポーネント — ユーザーが操作する画面
// ============================================================

import { useState } from "react";
import { REGION_OPTIONS, type Region } from "@/data/rules";
import { evaluate, type UserInput, type EvaluationResult } from "@/engine/evaluate";
import InsulationRTable from "@/components/InsulationRTable";

export default function Checker() {
  // ----- state: ユーザーの入力値を記憶する場所 -----
  const [region, setRegion] = useState<Region>(6); // 初期値は6地域（東京）
  const [roofR, setRoofR] = useState("");
  const [wallR, setWallR] = useState("");
  const [floorR, setFloorR] = useState("");
  const [windowU, setWindowU] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  // ----- 「チェック」ボタンが押された時の処理 -----
  function handleCheck() {
    // 入力値を数値に変換して判定エンジンに渡す
    const input: UserInput = {
      region,
      roofR: parseFloat(roofR) || 0,
      wallR: parseFloat(wallR) || 0,
      floorR: parseFloat(floorR) || 0,
      windowU: parseFloat(windowU) || 0,
    };
    setResult(evaluate(input));
  }

  // ----- 画面の描画 -----
  return (
    <div className="space-y-8">
      {/* ===== 入力フォーム ===== */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <h2 className="text-base font-bold">
          建物情報を入力してください
        </h2>

        {/* 地域選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            地域区分
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(Number(e.target.value) as Region)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {REGION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            お住まいの地域の区分がわからない場合は
            <a
              href="https://www.mlit.go.jp/jutakukentiku/house/04.html"
              target="_blank"
              className="text-blue-500 underline"
            >
              国交省の資料
            </a>
            をご確認ください
          </p>
        </div>

        {/* 断熱材の入力フィールド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField
            label="屋根/天井の熱抵抗値 R"
            unit="m²·K/W"
            value={roofR}
            onChange={setRoofR}
            placeholder="例: 4.6"
          />
          <NumberField
            label="外壁の熱抵抗値 R"
            unit="m²·K/W"
            value={wallR}
            onChange={setWallR}
            placeholder="例: 2.2"
          />
          <NumberField
            label="床の熱抵抗値 R"
            unit="m²·K/W"
            value={floorR}
            onChange={setFloorR}
            placeholder="例: 2.2"
          />
          <NumberField
            label="窓の熱貫流率 U"
            unit="W/(m²·K)"
            value={windowU}
            onChange={setWindowU}
            placeholder="例: 3.49"
          />
        </div>

        {/* チェックボタン */}
        <button
          onClick={handleCheck}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          仕様基準をチェックする
        </button>
      </section>

      {/* ===== 断熱材R値速查表 ===== */}
      <InsulationRTable />

      {/* ===== 結果表示 ===== */}
      {result && (
        <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          {/* 総合判定 */}
          <div
            className={`text-center py-4 rounded-lg text-lg font-bold ${
              result.allPassed
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {result.allPassed
              ? "✅ 仕様基準に適合しています"
              : "❌ 仕様基準に適合していません"}
          </div>

          <p className="text-sm text-gray-500 text-center">
            {result.regionName}・木造戸建住宅・仕様基準
          </p>

          {/* 各項目の詳細 */}
          <div className="space-y-3">
            {result.items.map((item) => (
              <div
                key={item.label}
                className={`border rounded-lg p-4 ${
                  item.passed
                    ? "border-green-200 bg-green-50/50"
                    : "border-red-200 bg-red-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {item.passed ? "✅" : "❌"} {item.label}
                  </span>
                  <span
                    className={`text-sm font-mono ${
                      item.passed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {item.userValue} {item.comparison} {item.requiredValue}{" "}
                    {item.unit}
                  </span>
                </div>
                {!item.passed && (
                  <p className="text-xs text-red-600 mt-2">
                    💡 基準目安: {item.hint}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* 免責事項 */}
          <p className="text-xs text-gray-400 text-center pt-2">
            ※本結果は仕様基準による簡易チェックであり、正式な適合性判定ではありません。
          </p>
        </section>
      )}
    </div>
  );
}

// ============================================================
// NumberField — 数値入力フィールド（小さな再利用可能パーツ）
// ============================================================
function NumberField({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <span className="text-xs text-gray-400 ml-1">[{unit}]</span>
      </label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
