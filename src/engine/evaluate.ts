// ============================================================
// 判定エンジン — ユーザーの入力をルールと照合する「厨師」
// ============================================================

import { RULES, type Region } from "@/data/rules";

// ----- ユーザーが入力するデータの型 -----
export interface UserInput {
  region: Region;
  roofR: number;   // 屋根/天井の熱抵抗値 R
  wallR: number;   // 外壁の熱抵抗値 R
  floorR: number;  // 床の熱抵抗値 R
  windowU: number; // 窓の熱貫流率 U
}

// ----- 判定結果の型 -----
export interface CheckItem {
  label: string;         // 部位名（例: "屋根または天井"）
  passed: boolean;       // 合格かどうか
  userValue: number;     // ユーザーの入力値
  requiredValue: number; // 基準値
  unit: string;          // 単位
  comparison: "≥" | "≤"; // 基準との比較方向
  hint: string;          // 基準の目安説明
}

export interface EvaluationResult {
  regionName: string;
  allPassed: boolean;    // 全項目合格 = 仕様基準適合
  items: CheckItem[];
}

// ----- メインの判定関数 -----
export function evaluate(input: UserInput): EvaluationResult {
  // 1. 選ばれた地域のルールを取得
  const rules = RULES[input.region];

  // 2. 各部位をチェック（R値は「以上」で合格）
  const roofCheck: CheckItem = {
    label: rules.insulation.roof.label,
    passed: input.roofR >= rules.insulation.roof.minR,
    userValue: input.roofR,
    requiredValue: rules.insulation.roof.minR,
    unit: "m²·K/W",
    comparison: "≥",
    hint: rules.insulation.roof.description,
  };

  const wallCheck: CheckItem = {
    label: rules.insulation.wall.label,
    passed: input.wallR >= rules.insulation.wall.minR,
    userValue: input.wallR,
    requiredValue: rules.insulation.wall.minR,
    unit: "m²·K/W",
    comparison: "≥",
    hint: rules.insulation.wall.description,
  };

  const floorCheck: CheckItem = {
    label: rules.insulation.floor.label,
    passed: input.floorR >= rules.insulation.floor.minR,
    userValue: input.floorR,
    requiredValue: rules.insulation.floor.minR,
    unit: "m²·K/W",
    comparison: "≥",
    hint: rules.insulation.floor.description,
  };

  // 3. 窓をチェック（U値は「以下」で合格 — 低いほど断熱性能が良い）
  const windowCheck: CheckItem = {
    label: "窓（開口部）",
    passed: input.windowU <= rules.window.maxU,
    userValue: input.windowU,
    requiredValue: rules.window.maxU,
    unit: "W/(m²·K)",
    comparison: "≤",
    hint: rules.window.description,
  };

  // 4. 全項目を集めて結果を返す
  const items = [roofCheck, wallCheck, floorCheck, windowCheck];

  return {
    regionName: rules.regionName,
    allPassed: items.every((item) => item.passed),
    items,
  };
}
