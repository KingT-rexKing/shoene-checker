// ============================================================
// 省エネ仕様基準 — 判定ルールデータ
// ============================================================
// このファイルが「菜谱」。省エネ法の基準値をデータとして整理したもの。
//
// 出典: 国土交通省「仕様基準ガイドブック【省エネ基準編】」
// https://www.mlit.go.jp/jutakukentiku/house/04.html
//
// ⚠️ MVP版は木造戸建住宅・地域区分4〜7のみ対応。
//    値は簡略化しています。正式な判定は登録機関にご確認ください。
// ============================================================

// ----- 类型定义（TypeScript用来描述数据的"形状"） -----

/** 地域区分（日本全国を気候で8つに分けたもの） */
export type Region = 4 | 5 | 6 | 7;

/** 建物の部位ごとの断熱基準 */
export interface InsulationRule {
  /** 部位の名前（日本語） */
  label: string;
  /** 基準となる熱抵抗値 R [m²·K/W]。これ以上あれば適合。 */
  minR: number;
  /** ユーザー向けの説明 */
  description: string;
}

/** 窓の基準 */
export interface WindowRule {
  /** 基準となる熱貫流率 U [W/(m²·K)]。これ以下であれば適合。 */
  maxU: number;
  /** ユーザー向けの説明 */
  description: string;
}

/** ある地域の仕様基準まるごと */
export interface RegionRules {
  regionNumber: Region;
  regionName: string;
  /** 代表的な都市（ユーザーが地域を選びやすくするため） */
  exampleCities: string[];
  /** 部位別の断熱基準 */
  insulation: {
    roof: InsulationRule;    // 屋根または天井
    wall: InsulationRule;    // 外壁
    floor: InsulationRule;   // 床
  };
  /** 窓の基準 */
  window: WindowRule;
}

// ----- 実際のルールデータ -----

export const RULES: Record<Region, RegionRules> = {
  4: {
    regionNumber: 4,
    regionName: "4地域",
    exampleCities: ["仙台市", "山形市", "福島市"],
    insulation: {
      roof: {
        label: "屋根または天井",
        minR: 4.6,
        description: "グラスウール16K相当で約185mm以上",
      },
      wall: {
        label: "外壁",
        minR: 2.2,
        description: "グラスウール16K相当で約90mm以上",
      },
      floor: {
        label: "床",
        minR: 2.2,
        description: "押出法ポリスチレンフォーム3種相当で約65mm以上",
      },
    },
    window: {
      maxU: 3.49,
      description: "Low-Eペアガラス（A10以上）＋樹脂サッシ 程度",
    },
  },

  5: {
    regionNumber: 5,
    regionName: "5地域",
    exampleCities: ["つくば市", "宇都宮市", "前橋市"],
    insulation: {
      roof: {
        label: "屋根または天井",
        minR: 4.6,
        description: "グラスウール16K相当で約185mm以上",
      },
      wall: {
        label: "外壁",
        minR: 2.2,
        description: "グラスウール16K相当で約90mm以上",
      },
      floor: {
        label: "床",
        minR: 2.2,
        description: "押出法ポリスチレンフォーム3種相当で約65mm以上",
      },
    },
    window: {
      maxU: 3.49,
      description: "Low-Eペアガラス（A10以上）＋樹脂サッシ 程度",
    },
  },

  6: {
    regionNumber: 6,
    regionName: "6地域",
    exampleCities: ["東京都", "横浜市", "名古屋市", "大阪市"],
    insulation: {
      roof: {
        label: "屋根または天井",
        minR: 4.0,
        description: "グラスウール16K相当で約160mm以上",
      },
      wall: {
        label: "外壁",
        minR: 1.7,
        description: "グラスウール16K相当で約70mm以上",
      },
      floor: {
        label: "床",
        minR: 1.7,
        description: "押出法ポリスチレンフォーム3種相当で約50mm以上",
      },
    },
    window: {
      maxU: 4.65,
      description: "ペアガラス＋アルミ樹脂複合サッシ 程度",
    },
  },

  7: {
    regionNumber: 7,
    regionName: "7地域",
    exampleCities: ["鹿児島市", "宮崎市", "長崎市"],
    insulation: {
      roof: {
        label: "屋根または天井",
        minR: 4.0,
        description: "グラスウール16K相当で約160mm以上",
      },
      wall: {
        label: "外壁",
        minR: 1.7,
        description: "グラスウール16K相当で約70mm以上",
      },
      floor: {
        label: "床",
        minR: 1.7,
        description: "押出法ポリスチレンフォーム3種相当で約50mm以上",
      },
    },
    window: {
      maxU: 4.65,
      description: "ペアガラス＋アルミ樹脂複合サッシ 程度",
    },
  },
};

/** 使いやすいように地域の選択肢を配列にしたもの */
export const REGION_OPTIONS = Object.values(RULES).map((r) => ({
  value: r.regionNumber,
  label: `${r.regionName}（${r.exampleCities.join("・")}）`,
}));
