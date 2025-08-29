import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getLogisticsByOrder } from "../Service/logisticsApi";

const ACCENT = "#E5C870";
const BG = "#0A0A0A";

const Badge = ({ children }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    style={{ backgroundColor: "rgba(229,200,112,0.15)", color: ACCENT, border: `1px solid ${ACCENT}33` }}
  >
    {children}
  </span>
);

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text || "");
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="rounded-lg border px-2 py-1 text-xs"
      style={{ borderColor: ACCENT, color: ACCENT }}
      title="Copy"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "-");
const fmtDateOnly = (d) => (d ? new Date(d).toLocaleDateString() : "-");

export default function TrackOrder() {
  // Accept /track/:orderId OR /track/:id
  const { orderId: p1, id: p2 } = useParams();
  const orderId = p1 || p2 || "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const orderSummary = useMemo(() => {
    const first = rows?.[0];
    const o = first?.orderId;
    if (!o) return null;
    return typeof o === "object"
      ? { id: o._id, status: o.status, total: o.total }
      : { id: o };
  }, [rows]);

  const fetchData = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setErr("");
      const res = await getLogisticsByOrder(orderId, { populate: true });
      // controller returns array sorted by createdAt desc
      setRows(Array.isArray(res) ? res : res?.logistics ?? []);
    } catch (e) {
      setErr(e?.message || "Failed to fetch logistics");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-4xl px-4 py-8 text-white">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order Tracking</h1>
            <p className="mt-1 text-sm text-gray-300">
              Order ID:&nbsp;
              <span className="font-mono">{orderSummary?.id || orderId || "-"}</span>
            </p>
            {orderSummary?.status && (
              <div className="mt-2">
                <Badge>Status: {orderSummary.status}</Badge>
                {typeof orderSummary.total !== "undefined" && (
                  <span className="ml-2 text-sm text-gray-300">
                    Total: ₹{Number(orderSummary.total).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="rounded-xl px-4 py-2 font-semibold transition"
              style={{
                backgroundColor: ACCENT,
                color: "#0A0A0A",
                boxShadow: "0 0 0 1px rgba(229,200,112,0.25) inset",
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#111", border: `1px solid ${ACCENT}33` }}>
            <div className="h-4 w-40 animate-pulse rounded bg-gray-700" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-800" />
            <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-gray-800" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-800" />
          </div>
        )}

        {!loading && err && (
          <div
            className="rounded-2xl border p-4 text-sm"
            style={{ borderColor: "#ff4d4f66", backgroundColor: "#2a1414" }}
          >
            {err}
          </div>
        )}

        {!loading && !err && rows.length === 0 && (
          <div
            className="rounded-2xl border p-6 text-center text-sm"
            style={{ borderColor: `${ACCENT}33`, backgroundColor: "#101010" }}
          >
            No logistics found for this order yet.
          </div>
        )}

        {/* Timeline */}
        {!loading && !err && rows.length > 0 && (
          <div className="relative mt-4">
            {/* vertical line */}
            <div
              className="absolute left-4 top-0 h-full w-px"
              style={{ background: `linear-gradient(${ACCENT}, transparent)` }}
            />
            <ul className="space-y-4">
              {rows.map((l) => {
                const imgs = Array.isArray(l.img) ? l.img : [];
                const awb = l.trackingNumber || "";
                return (
                  <li
                    key={l._id}
                    className="relative ml-10 rounded-2xl p-4"
                    style={{ backgroundColor: "#101010", border: `1px solid ${ACCENT}22` }}
                  >
                    {/* node dot */}
                    <span
                      className="absolute -left-6 top-5 block h-3 w-3 rounded-full ring-4"
                      style={{
                        backgroundColor: ACCENT,
                        ringColor: "#0A0A0A",
                        boxShadow: "0 0 0 2px rgba(229,200,112,0.3)",
                      }}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">Logistic Update</h3>
                        <Badge>{fmtDate(l.createdAt)}</Badge>
                      </div>
                      {awb && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">
                            Tracking:&nbsp;
                            <span className="font-mono text-white">{awb}</span>
                          </span>
                          <CopyBtn text={awb} />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <InfoRow label="Carrier" value={l.carrier || "-"} />
                      <InfoRow label="Estimated Delivery" value={fmtDateOnly(l.estimatedDelivery)} />
                      <InfoRow label="Updated At" value={fmtDate(l.updatedAt)} />
                      <InfoRow label="Logistic Id" value={<span className="font-mono">{l._id}</span>} />
                    </div>

                    <div className="mt-3">
                      <Label>Shipping Address</Label>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-200">
                        {l.shippingAddress || "-"}
                      </p>
                    </div>

                    {l.note && (
                      <div className="mt-3">
                        <Label>Note</Label>
                        <p className="mt-1 text-sm text-gray-200">{l.note}</p>
                      </div>
                    )}

                    {imgs.length > 0 && (
                      <div className="mt-4">
                        <Label>Images</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {imgs.map((im, idx) => {
                            const src = typeof im === "string" ? im : im?.URL;
                            if (!src) return null;
                            return (
                              <a
                                key={idx}
                                href={src}
                                target="_blank"
                                rel="noreferrer"
                                title={src}
                                className="block"
                              >
                                <img
                                  src={src}
                                  alt=""
                                  className="h-16 w-16 rounded-lg object-cover ring-1"
                                  style={{ ringColor: `${ACCENT}44` }}
                                  onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 text-sm text-gray-200">{value || "-"}</div>
    </div>
  );
}
