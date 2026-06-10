"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { REGION_OPTIONS, RULES, type Region } from "@/data/rules";
import { evaluate, type UserInput, type EvaluationResult, type CheckItem } from "@/engine/evaluate";

// ── Material database ─────────────────────────────────────────────────────
const MATERIALS = [
  { label: "グラスウール 16K",      lambda: 0.045, category: "壁・屋根・天井" },
  { label: "高性能 GW 16K",         lambda: 0.038, category: "壁・屋根・天井" },
  { label: "高性能 GW 24K",         lambda: 0.036, category: "壁・屋根・天井" },
  { label: "高性能 GW 32K",         lambda: 0.035, category: "壁・屋根・天井" },
  { label: "吹付ウレタン A種1H",    lambda: 0.026, category: "壁・屋根・天井" },
  { label: "ロックウール 40K",       lambda: 0.038, category: "壁・屋根・天井" },
  { label: "セルロースファイバー",   lambda: 0.040, category: "壁・屋根・天井" },
  { label: "押出法PS 3種（XPS）",   lambda: 0.028, category: "床・基礎" },
  { label: "硬質ウレタン 2種",       lambda: 0.024, category: "床・基礎" },
];

// ── Ripple helper ─────────────────────────────────────────────────────────
function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.5;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;
  const spot = document.createElement("span");
  spot.className = "btn-ripple-spot";
  spot.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(spot);
  setTimeout(() => spot.remove(), 600);
}

// ── Gauge bar ─────────────────────────────────────────────────────────────
function GaugeBar({ ratio, active }: { ratio: number; active: boolean }) {
  const pct = Math.min(Math.max(ratio * 100, 0), 100);
  let bg = "#e2e8f0";
  if (active) {
    if (ratio >= 1)         bg = "linear-gradient(90deg, #10b981, #34d399)";
    else if (ratio >= 0.72) bg = "linear-gradient(90deg, #f59e0b, #fbbf24)";
    else                    bg = "linear-gradient(90deg, #f87171, #fb923c)";
  }
  return (
    <div style={{ height: 3, background: "#e8eaf6", borderRadius: 99, marginTop: 6, overflow: "hidden" }}>
      <div
        className="animate-gauge"
        style={{
          height: "100%",
          width: active ? `${pct}%` : "0%",
          background: bg,
          borderRadius: 99,
          transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

// ── Floating-label input ──────────────────────────────────────────────────
function FloatingInput({
  id, label, unit, value, onChange, ratio, onCalc,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  ratio: number;
  onCalc?: () => void;
}) {
  const active = value !== "" && parseFloat(value) > 0;
  const statusClass = !active ? "" : ratio >= 1 ? "is-pass" : "is-fail";

  return (
    <div>
      <div className="field-wrap">
        <input
          id={id}
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          className={`field-input ${statusClass}`}
        />
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
        <span className="field-unit">[{unit}]</span>
      </div>

      <GaugeBar ratio={ratio} active={active} />

      <div className="flex items-center justify-between mt-1 min-h-[16px]">
        {active ? (
          <p style={{ fontSize: 11, color: ratio >= 1 ? "#059669" : "#ef4444" }}>
            {ratio >= 1
              ? `✓ クリア（+${((ratio - 1) * 100).toFixed(0)}% 余裕）`
              : `▲ あと ${Math.max(0, (parseFloat(value) * (1 / ratio - 1))).toFixed(2)} ${unit} 不足`}
          </p>
        ) : (
          <span />
        )}
        {onCalc && (
          <button
            type="button"
            onClick={onCalc}
            style={{ fontSize: 11, color: "#6366f1", cursor: "pointer", background: "none", border: "none", padding: 0 }}
            className="hover:underline transition-colors"
          >
            材料から計算 ↗
          </button>
        )}
      </div>
    </div>
  );
}

// ── Result item card ──────────────────────────────────────────────────────
function ResultCard({ item, index }: { item: CheckItem; index: number }) {
  const pct = Math.min(item.ratio * 100, 100);
  const isNA = item.requiredValue === 0 || item.requiredValue === Infinity;

  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 0.07}s`,
        background: item.passed
          ? "rgba(236,253,245,0.85)"
          : "rgba(255,241,242,0.85)",
        border: `1px solid ${item.passed ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.3)"}`,
        borderRadius: 16,
        padding: "14px 16px",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 8, height: 8,
              borderRadius: "50%",
              background: item.passed ? "#10b981" : "#f87171",
              display: "inline-block",
              flexShrink: 0,
              marginTop: 2,
              boxShadow: item.passed ? "0 0 6px rgba(16,185,129,0.5)" : "0 0 6px rgba(248,113,113,0.5)",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.label}</span>
        </div>
        <span
          style={{
            fontSize: 12,
            fontFamily: "ui-monospace, 'SF Mono', monospace",
            fontWeight: 600,
            color: item.passed ? "#065f46" : "#991b1b",
            flexShrink: 0,
          }}
        >
          {item.userValue} {item.comparison} {isNA ? "—" : item.requiredValue} <span style={{ fontWeight: 400 }}>{item.unit}</span>
        </span>
      </div>

      {/* Mini gauge */}
      {!isNA && (
        <div style={{ marginTop: 10, height: 5, background: "rgba(255,255,255,0.6)", borderRadius: 99, overflow: "hidden" }}>
          <div
            className="animate-gauge"
            style={{
              height: "100%",
              width: `${pct}%`,
              background: item.passed
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #f87171, #fb923c)",
              borderRadius: 99,
            }}
          />
        </div>
      )}

      {!item.passed && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#9f1239",
            background: "rgba(255,228,230,0.7)",
            borderRadius: 10,
            padding: "6px 10px",
            lineHeight: 1.6,
          }}
        >
          <span style={{ fontWeight: 700 }}>改善目安: </span>{item.hint}
        </div>
      )}
    </div>
  );
}

// ── Material Calculator Modal ─────────────────────────────────────────────
function MaterialCalcModal({
  targetLabel, onClose, onApply,
}: {
  targetLabel: string;
  onClose: () => void;
  onApply: (r: string) => void;
}) {
  const [matIdx, setMatIdx] = useState(0);
  const [thickness, setThickness] = useState("100");
  const mat = MATERIALS[matIdx];
  const rVal = mat ? (parseFloat(thickness) / (mat.lambda * 1000)) : 0;
  const rStr = isNaN(rVal) || rVal <= 0 ? "—" : rVal.toFixed(2);

  const PRESETS = [50, 75, 100, 105, 120, 140, 155, 185, 210];

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "flex-end",
        justifyContent: "center", padding: "16px",
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-up"
        style={{
          width: "100%", maxWidth: 400,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px) saturate(1.5)",
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 20px 60px rgba(99,102,241,0.2), 0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(148,163,184,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>R値を材料から計算</p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>対象: {targetLabel}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(241,245,249,0.8)",
              border: "none", cursor: "pointer",
              fontSize: 16, color: "#64748b",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Material select */}
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              断熱材の種類
            </label>
            <select
              value={matIdx}
              onChange={(e) => setMatIdx(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 13,
                border: "1.5px solid rgba(148,163,184,0.3)",
                borderRadius: 12,
                background: "rgba(248,250,252,0.8)",
                color: "#1e293b",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {MATERIALS.map((m, i) => (
                <option key={i} value={i}>{m.label}（λ={m.lambda}）</option>
              ))}
            </select>
          </div>

          {/* Thickness */}
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              厚さ
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min="0"
                step="5"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                style={{
                  flex: 1, height: 44, padding: "0 12px",
                  fontSize: 16, fontFamily: "ui-monospace, monospace",
                  border: "1.5px solid rgba(99,102,241,0.35)",
                  borderRadius: 12,
                  background: "rgba(238,241,255,0.5)",
                  color: "#1e293b", outline: "none",
                }}
              />
              <span style={{ fontSize: 13, color: "#64748b", flexShrink: 0 }}>mm</span>
            </div>
            {/* Preset chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setThickness(String(t))}
                  className={`thickness-chip ${thickness === String(t) ? "selected" : ""}`}
                >
                  {t}mm
                </button>
              ))}
            </div>
          </div>

          {/* Result display */}
          <div
            style={{
              borderRadius: 16,
              padding: "16px",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(238,241,255,0.9), rgba(245,243,255,0.9))",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <p style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>熱抵抗値 R</p>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#3730a3", fontFamily: "ui-monospace, monospace", lineHeight: 1 }}>{rStr}</p>
            <p style={{ fontSize: 11, color: "#818cf8", marginTop: 4 }}>m²·K/W</p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
          <button className="btn-cancel" onClick={onClose}>キャンセル</button>
          <button
            className="btn-apply"
            onClick={() => { if (rStr !== "—") { onApply(rStr); onClose(); } }}
          >
            この値を入力 →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Checker ──────────────────────────────────────────────────────────
export default function Checker() {
  const [region, setRegion] = useState<Region>(6);
  const [roofR,   setRoofR]   = useState("");
  const [wallR,   setWallR]   = useState("");
  const [floorR,  setFloorR]  = useState("");
  const [windowU, setWindowU] = useState("");
  const [result,    setResult]    = useState<EvaluationResult | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [calcTarget, setCalcTarget] = useState<null | "roof" | "wall" | "floor">(null);

  const rules = RULES[region];

  // Live gauge ratios
  const roofRatio = useMemo(() => {
    const v = parseFloat(roofR); const req = rules.insulation.roof.minR;
    return req > 0 && v > 0 ? v / req : 0;
  }, [roofR, rules]);
  const wallRatio = useMemo(() => {
    const v = parseFloat(wallR); const req = rules.insulation.wall.minR;
    return req === 0 ? 1 : req > 0 && v > 0 ? v / req : 0;
  }, [wallR, rules]);
  const floorRatio = useMemo(() => {
    const v = parseFloat(floorR); const req = rules.insulation.floor.minR;
    return req === 0 ? 1 : req > 0 && v > 0 ? v / req : 0;
  }, [floorR, rules]);
  const windowRatio = useMemo(() => {
    const v = parseFloat(windowU); const req = rules.window.maxU;
    return req === Infinity ? 1 : req > 0 && v > 0 ? req / v : 0;
  }, [windowU, rules]);

  const handleCheck = useCallback(() => {
    const input: UserInput = {
      region,
      roofR:   parseFloat(roofR)   || 0,
      wallR:   parseFloat(wallR)   || 0,
      floorR:  parseFloat(floorR)  || 0,
      windowU: parseFloat(windowU) || 0,
    };
    setResult(evaluate(input));
    setResultKey((k) => k + 1);
  }, [region, roofR, wallR, floorR, windowU]);

  const handleRegionChange = (r: Region, e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    setRegion(r);
    setResult(null);
  };

  const calcTargetLabel =
    calcTarget === "roof" ? "屋根/天井" :
    calcTarget === "wall" ? "外壁" : "床";

  const handleCalcApply = (r: string) => {
    if (calcTarget === "roof")  setRoofR(r);
    if (calcTarget === "wall")  setWallR(r);
    if (calcTarget === "floor") setFloorR(r);
  };

  return (
    <div className="space-y-5">

      {/* ── Region selector ── */}
      <section className="glass-card" style={{ padding: "20px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            地域区分を選択
          </p>
          <a
            href="https://www.mlit.go.jp/jutakukentiku/house/04.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "#6366f1" }}
            className="hover:underline"
          >
            地域を確認 →
          </a>
        </div>

        {/* Region buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginBottom: 10 }}>
          {([1,2,3,4,5,6,7,8] as Region[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={(e) => handleRegionChange(r, e)}
              className={`region-btn ${region === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Region info chip */}
        <div
          style={{
            fontSize: 12, padding: "7px 12px",
            background: "rgba(238,241,255,0.6)",
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#475569",
          }}
        >
          <span style={{ fontWeight: 700, color: "#3730a3" }}>{rules.regionName}</span>
          <span style={{ margin: "0 8px", color: "#c7d2fe" }}>|</span>
          {rules.exampleCities.join("・")}
        </div>
      </section>

      {/* ── Insulation inputs ── */}
      <section className="glass-card" style={{ padding: "20px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
          断熱性能の入力
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px 20px" }}>
          <FloatingInput
            id="roofR" label="屋根/天井の熱抵抗値 R" unit="m²·K/W"
            value={roofR} onChange={setRoofR} ratio={roofRatio}
            onCalc={() => setCalcTarget("roof")}
          />
          <FloatingInput
            id="wallR" label="外壁の熱抵抗値 R" unit="m²·K/W"
            value={wallR} onChange={setWallR} ratio={wallRatio}
            onCalc={() => setCalcTarget("wall")}
          />
          <FloatingInput
            id="floorR" label="床の熱抵抗値 R" unit="m²·K/W"
            value={floorR} onChange={setFloorR} ratio={floorRatio}
            onCalc={() => setCalcTarget("floor")}
          />

          {/* Window U — no material calc */}
          <div>
            <div className="field-wrap">
              <input
                id="windowU"
                type="number"
                step="0.01"
                min="0"
                value={windowU}
                onChange={(e) => setWindowU(e.target.value)}
                placeholder=" "
                disabled={rules.window.maxU === Infinity}
                className={`field-input ${
                  rules.window.maxU === Infinity
                    ? ""
                    : windowU && parseFloat(windowU) > 0
                      ? windowRatio >= 1 ? "is-pass" : "is-fail"
                      : ""
                }`}
                style={rules.window.maxU === Infinity ? { opacity: 0.45, cursor: "not-allowed" } : {}}
              />
              <label className="field-label" htmlFor="windowU">
                {rules.window.maxU === Infinity ? "窓の熱貫流率 U（8地域: 基準なし）" : "窓の熱貫流率 U"}
              </label>
              <span className="field-unit">[W/(m²·K)]</span>
            </div>
            <GaugeBar
              ratio={windowRatio}
              active={rules.window.maxU < Infinity && windowU !== "" && parseFloat(windowU) > 0}
            />
            <div style={{ minHeight: 16, marginTop: 4 }}>
              {rules.window.maxU < Infinity && windowU && parseFloat(windowU) > 0 && (
                <p style={{ fontSize: 11, color: windowRatio >= 1 ? "#059669" : "#ef4444" }}>
                  {windowRatio >= 1
                    ? `✓ クリア（基準 ≤${rules.window.maxU}）`
                    : `▲ 基準値 ${rules.window.maxU} 以下が必要`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Region 8 warning */}
        {region === 8 && (
          <div
            style={{
              marginTop: 16, padding: "10px 14px",
              background: "rgba(255,251,235,0.8)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 12, fontSize: 12,
              color: "#92400e", lineHeight: 1.6,
            }}
          >
            <span style={{ fontWeight: 700 }}>⚠️ 8地域（沖縄）ご注意 —</span>
            {" "}外壁・床の断熱基準はありませんが、窓の<strong>日射遮蔽（ηAC値）</strong>が主要件です。本ツールは未対応のため専門家にご相談ください。
          </div>
        )}

        {/* CTA button */}
        <button
          className="btn-cta"
          onClick={(e) => { addRipple(e); handleCheck(); }}
          style={{ marginTop: 20 }}
        >
          <span className="btn-cta-shimmer" />
          仕様基準をチェックする　→
        </button>
      </section>

      {/* ── Results ── */}
      {result && (
        <section key={resultKey} className="animate-fade-up">
          {/* Verdict card */}
          <div
            className="animate-celebrate"
            style={{
              borderRadius: 20, padding: "20px 24px",
              marginBottom: 12, textAlign: "center",
              background: result.allPassed
                ? "linear-gradient(135deg, #059669 0%, #0d9488 100%)"
                : "linear-gradient(135deg, #e11d48 0%, #db2777 100%)",
              boxShadow: result.allPassed
                ? "0 8px 32px rgba(5,150,105,0.4)"
                : "0 8px 32px rgba(225,29,72,0.4)",
              color: "white",
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              {result.allPassed ? "✓ 仕様基準に適合" : "✗ 仕様基準に不適合"}
            </p>
            <p style={{ fontSize: 13, opacity: 0.82 }}>
              {result.regionName} · 木造戸建住宅 · 仕様基準（簡易ルート）
            </p>
            <p style={{ fontSize: 11, opacity: 0.65, marginTop: 4 }}>
              {result.allPassed
                ? `全 ${result.items.length} 項目クリア`
                : `${result.items.filter(i => !i.passed).length} 項目が基準未達`}
            </p>
          </div>

          {/* Item cards */}
          <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.items.map((item, i) => (
              <ResultCard key={item.label} item={item} index={i} />
            ))}
          </div>

          <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 14 }}>
            ※ 本結果は仕様基準による簡易チェックです。正式な適合性判定は登録判定機関にご確認ください。
          </p>
        </section>
      )}

      {/* Material calculator modal */}
      {calcTarget && (
        <MaterialCalcModal
          targetLabel={calcTargetLabel}
          onClose={() => setCalcTarget(null)}
          onApply={handleCalcApply}
        />
      )}
    </div>
  );
}
