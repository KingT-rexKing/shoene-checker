import { RULES, type Region } from "@/data/rules";

export interface UserInput {
  region: Region;
  roofR: number;
  wallR: number;
  floorR: number;
  windowU: number;
}

export interface CheckItem {
  label: string;
  passed: boolean;
  userValue: number;
  requiredValue: number;
  unit: string;
  comparison: "≥" | "≤";
  hint: string;
  /** 不足量。正 = まだ足りない、負 = 余裕あり */
  gap: number;
  /** 達成率 (0〜1+)。ゲージ表示用 */
  ratio: number;
}

export interface EvaluationResult {
  regionName: string;
  allPassed: boolean;
  items: CheckItem[];
}

export function evaluate(input: UserInput): EvaluationResult {
  const rules = RULES[input.region];

  const roofCheck: CheckItem = {
    label: rules.insulation.roof.label,
    passed: input.roofR >= rules.insulation.roof.minR,
    userValue: input.roofR,
    requiredValue: rules.insulation.roof.minR,
    unit: "m²·K/W",
    comparison: "≥",
    hint: rules.insulation.roof.description,
    gap: rules.insulation.roof.minR - input.roofR,
    ratio: rules.insulation.roof.minR > 0 ? input.roofR / rules.insulation.roof.minR : 1,
  };

  const wallCheck: CheckItem = {
    label: rules.insulation.wall.label,
    passed: rules.insulation.wall.minR === 0 || input.wallR >= rules.insulation.wall.minR,
    userValue: input.wallR,
    requiredValue: rules.insulation.wall.minR,
    unit: "m²·K/W",
    comparison: "≥",
    hint: rules.insulation.wall.description,
    gap: rules.insulation.wall.minR - input.wallR,
    ratio: rules.insulation.wall.minR > 0 ? input.wallR / rules.insulation.wall.minR : 1,
  };

  const floorCheck: CheckItem = {
    label: rules.insulation.floor.label,
    passed: rules.insulation.floor.minR === 0 || input.floorR >= rules.insulation.floor.minR,
    userValue: input.floorR,
    requiredValue: rules.insulation.floor.minR,
    unit: "m²·K/W",
    comparison: "≥",
    hint: rules.insulation.floor.description,
    gap: rules.insulation.floor.minR - input.floorR,
    ratio: rules.insulation.floor.minR > 0 ? input.floorR / rules.insulation.floor.minR : 1,
  };

  const windowCheck: CheckItem = {
    label: "窓（開口部）",
    passed: rules.window.maxU === Infinity || input.windowU <= rules.window.maxU,
    userValue: input.windowU,
    requiredValue: rules.window.maxU,
    unit: "W/(m²·K)",
    comparison: "≤",
    hint: rules.window.description,
    gap: input.windowU - rules.window.maxU,
    ratio:
      rules.window.maxU < Infinity && input.windowU > 0
        ? rules.window.maxU / input.windowU
        : 1,
  };

  const items = [roofCheck, wallCheck, floorCheck, windowCheck];

  return {
    regionName: rules.regionName,
    allPassed: items.every((item) => item.passed),
    items,
  };
}
