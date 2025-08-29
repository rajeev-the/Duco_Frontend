import React, { useEffect, useMemo, useState } from "react";

/**
 * ChargePlanManager.jsx
 * UI to Create / Update the single ChargePlan document with three tier arrays:
 * - pakageingandforwarding
 * - printingcost
 * - gst
 *
 * Endpoints expected:
 *   GET   /api/chargeplan
 *   PATCH /api/chargeplan
 *   GET   /api/logistic/rates?qty=60
 *   GET   /api/chargeplan/totals?qty=60
 *
 * Styling: Dark (#0A0A0A) background, white text, accent #E5C870
 */

// Adjust this if your server uses a different base path
const API_BASE = "https://duco-backend.onrender.com" || ""; // e.g., "" when same origin

const ACCENT = "#E5C870";
const BG = "#0A0A0A";

// ---- Reusable helpers ----
const emptyTier = (min = 1, max = 1, cost = 0) => ({ minqty: min, maxqty: max, cost });

const classNames = (...c) => c.filter(Boolean).join(" ");

// Turn server data into a proper tier array
const toTierList = (x) => {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object" && ("minqty" in x || "minQty" in x)) {
    const minqty = Number(x.minqty ?? x.minQty ?? 1);
    const maxqty = Number(x.maxqty ?? x.maxQty ?? minqty);
    const cost = Number(x.cost ?? 0);
    return [{ minqty, maxqty, cost }];
  }
  return [emptyTier(1, 1, 0)];
};

const sortTiers = (arr) => [...arr].sort((a, b) => Number(a.minqty) - Number(b.minqty));

function validateTiers(tiers) {
  const issues = [];
  if (!Array.isArray(tiers) || tiers.length === 0) {
    issues.push("At least one tier required");
    return issues;
  }

  const s = sortTiers(tiers);
  for (let i = 0; i < s.length; i++) {
    const t = s[i];
    const min = Number(t.minqty);
    const max = Number(t.maxqty);
    const cost = Number(t.cost);
    if (!Number.isFinite(min) || min < 1) issues.push(`Row ${i + 1}: minqty must be >= 1`);
    if (!Number.isFinite(max) || max < min) issues.push(`Row ${i + 1}: maxqty must be >= minqty`);
    if (!Number.isFinite(cost) || cost < 0) issues.push(`Row ${i + 1}: cost must be >= 0`);
    if (i > 0) {
      const prev = s[i - 1];
      if (min <= Number(prev.maxqty)) issues.push(`Row ${i + 1}: overlaps previous maxqty (${prev.maxqty})`);
    }
  }
  return issues;
}

// normalize NaN from number inputs so controlled fields don't blow up
const numOrEmpty = (v) => (Number.isFinite(v) ? v : "");


// ---- Tier table component ----
function TierTable({ label, rows, setRows }) {
  // Always operate on an array
  const safeRows = useMemo(() => toTierList(rows), [rows]);

  const issues = useMemo(() => validateTiers(safeRows), [safeRows]);

  const onChange = (idx, key, val) => {
    setRows((prev) => {
      const base = toTierList(prev);
      return base.map((r, i) => (i === idx ? { ...r, [key]: val } : r));
    });
  };

  const addRow = () => {
    const s = sortTiers(safeRows);
    const last = s[s.length - 1] || { minqty: 0, maxqty: 0 };
    const nextMin = Number(last.maxqty) + 1 || 1;
    setRows((prev) => sortTiers([...toTierList(prev), emptyTier(nextMin, nextMin, 0)]));
  };

  const removeRow = (idx) => {
    setRows((prev) => toTierList(prev).filter((_, i) => i !== idx));
  };

  const sortNow = () => setRows((prev) => sortTiers(toTierList(prev)));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{label}</h3>
        <div className="flex gap-2">
          <button
            onClick={sortNow}
            className="px-3 py-1 rounded border"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Sort
          </button>
          <button
            onClick={addRow}
            className="px-3 py-1 rounded"
            style={{ background: ACCENT, color: BG }}
          >
            Add Tier
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg" style={{ borderColor: "#1f2937" }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800/60">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Min Qty</th>
              <th className="px-3 py-2 text-left">Max Qty</th>
              <th className="px-3 py-2 text-left">Cost (per unit)</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeRows.map((r, i) => (
              <tr key={i} className="border-t border-gray-800">
                <td className="px-3 py-2 align-middle">{i + 1}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={numOrEmpty(r.minqty)}
                    onChange={(e) => onChange(i, "minqty", numOrEmpty(e.target.valueAsNumber))}
                    className="w-32 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-1"
                    style={{ borderColor: "#374151" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={numOrEmpty(r.maxqty)}
                    onChange={(e) => onChange(i, "maxqty", numOrEmpty(e.target.valueAsNumber))}
                    className="w-32 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-1"
                    style={{ borderColor: "#374151" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={numOrEmpty(r.cost)}
                    onChange={(e) => onChange(i, "cost", numOrEmpty(e.target.valueAsNumber))}
                    className="w-40 bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-1"
                    style={{ borderColor: "#374151" }}
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => removeRow(i)}
                    className="px-3 py-1 rounded border hover:bg-gray-800"
                    style={{ borderColor: "#4b5563", color: "#f87171" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {safeRows.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-center text-gray-400" colSpan={5}>
                  No tiers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {issues.length > 0 && (
        <div className="mt-2 text-xs text-rose-300">
          <ul className="list-disc pl-5">
            {issues.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ChargePlanManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [plan, setPlan] = useState({
    pakageingandforwarding: [emptyTier(1, 1, 0)],
    printingcost: [emptyTier(1, 1, 0)],
    gst: [emptyTier(1, 1, 0)],
  });

  const [qty, setQty] = useState(50);
  const [preview, setPreview] = useState(null);

  // Fetch plan
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/chargeplan`);
        const json = await res.json();
        if (!alive) return;
        if (json.success) {
          setPlan({
            pakageingandforwarding: toTierList(json.data.pakageingandforwarding),
            printingcost: toTierList(json.data.printingcost),
            gst: toTierList(json.data.gst),
          });
          setError("");
        } else {
          setError(json.error || "Failed to load plan");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const issuesAll = useMemo(
    () => ({
      pakageingandforwarding: validateTiers(toTierList(plan.pakageingandforwarding)),
      printingcost: validateTiers(toTierList(plan.printingcost)),
      gst: validateTiers(toTierList(plan.gst)),
    }),
    [plan]
  );

  const hasIssues = useMemo(() => {
    return Object.values(issuesAll).some((list) => list.length > 0);
  }, [issuesAll]);

  const save = async () => {
    setOk("");
    setError("");
    if (hasIssues) {
      setError("Fix validation errors before saving.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        pakageingandforwarding: toTierList(plan.pakageingandforwarding),
        printingcost: toTierList(plan.printingcost),
        gst: toTierList(plan.gst),
      };
      const res = await fetch(`${API_BASE}/api/chargeplan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setOk("Saved successfully ✔");
        setPlan({
          pakageingandforwarding: toTierList(json.data.pakageingandforwarding),
          printingcost: toTierList(json.data.printingcost),
          gst: toTierList(json.data.gst),
        });
      } else {
        setError(json.error || "Failed to save");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const refresh = async () => {
    setError("");
    setOk("");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/chargeplan`);
      const json = await res.json();
      if (json.success) {
        setPlan({
          pakageingandforwarding: toTierList(json.data.pakageingandforwarding),
          printingcost: toTierList(json.data.printingcost),
          gst: toTierList(json.data.gst),
        });
      } else {
        setError(json.error || "Failed to refresh");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const simulate = async () => {
    setPreview(null);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/chargeplan/totals?qty=${qty}`);
      const json = await res.json();
      if (json.success) setPreview(json.data);
      else setError(json.error || "Failed to simulate");
    } catch (e) {
      setError(e.message);
    }
  };

  const card = "rounded-2xl p-5 border";

  return (
    <div className="min-h-screen" style={{ background: BG, color: "#FFFFFF" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: ACCENT }}>
            Charge Plan Manager
          </h1>
          <p className="text-sm text-gray-300">
            Create & update tiers for Packaging & Forwarding, Printing Cost, and GST. Values are
            per-unit and vary by quantity range.
          </p>
        </header>

        {/* Feedback banners */}
        {error && (
          <div className={classNames(card, "mb-6 bg-rose-900/30 border-rose-700 text-rose-200")}>
            {error}
          </div>
        )}
        {ok && (
          <div
            className={classNames(
              card,
              "mb-6 bg-emerald-900/30 border-emerald-700 text-emerald-200"
            )}
          >
            {ok}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={save}
            disabled={saving || loading}
            className={classNames(
              "px-4 py-2 rounded-xl font-medium disabled:opacity-50",
              saving ? "cursor-wait" : "hover:opacity-90"
            )}
            style={{ background: ACCENT, color: BG }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 rounded-xl font-medium border hover:bg-gray-800 disabled:opacity-50"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Refresh from Server
          </button>
          {hasIssues && (
            <span className="text-rose-300 text-sm">Resolve validation issues before saving.</span>
          )}
        </div>

        {/* Grids */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className={classNames(card, "bg-black/20 border-gray-800")}>
            <TierTable
              label="Packaging & Forwarding"
              rows={plan.pakageingandforwarding}
              setRows={(newRows) =>
                setPlan((p) => ({ ...p, pakageingandforwarding: toTierList(newRows) }))
              }
            />
          </div>

          <div className={classNames(card, "bg-black/20 border-gray-800")}>
            <TierTable
              label="Printing Cost"
              rows={plan.printingcost}
              setRows={(newRows) => setPlan((p) => ({ ...p, printingcost: toTierList(newRows) }))}
            />
          </div>

          <div className={classNames(card, "bg-black/20 border-gray-800")}>
            <TierTable
              label="GST"
              rows={plan.gst}
              setRows={(newRows) => setPlan((p) => ({ ...p, gst: toTierList(newRows) }))}
            />
          </div>
        </div>

        {/* Simulator */}
        <section className={classNames(card, "bg-black/20 border-gray-800 mt-6")}>
          <h3 className="text-lg font-semibold mb-3">Quick Simulator</h3>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="block text-gray-300 mb-1">Quantity</span>
              <input
                type="number"
                min={1}
                value={numOrEmpty(qty)}
                onChange={(e) =>
                  setQty(Number.isFinite(e.target.valueAsNumber) ? e.target.valueAsNumber : 1)
                }
                className="bg-transparent border rounded px-3 py-2 focus:outline-none focus:ring-1"
                style={{ borderColor: "#374151" }}
              />
            </label>
            <button
              onClick={simulate}
              className="px-4 py-2 rounded-xl font-medium"
              style={{ background: ACCENT, color: BG }}
            >
              Compute Totals
            </button>
          </div>

          {preview && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-xs text-gray-400">Qty</div>
                <div className="text-xl font-semibold">{preview.qty}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-xs text-gray-400">Packaging & Fwd (per-unit)</div>
                <div className="text-lg">{preview.perUnit?.pakageingandforwarding}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-xs text-gray-400">Printing (per-unit)</div>
                <div className="text-lg">{preview.perUnit?.printingcost}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50">
                <div className="text-xs text-gray-400">GST (per-unit)</div>
                <div className="text-lg">{preview.perUnit?.gst}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50 sm:col-span-2 lg:col-span-4">
                <div className="text-xs text-gray-400">Grand Total</div>
                <div className="text-2xl font-bold" style={{ color: ACCENT }}>
                  {preview.totals?.grandTotal}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
            <div className="px-4 py-3 rounded-xl border" style={{ borderColor: ACCENT }}>
              <div className="animate-pulse text-sm" style={{ color: ACCENT }}>
                Loading plan…
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
