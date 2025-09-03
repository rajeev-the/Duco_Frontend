// Responsive Multi-View Designer — mobile‑first, percent positions per view
// - Stores positions in % so designs stay aligned across screen sizes
// - Fully responsive canvas using aspect-ratio box (40:38)
// - Mobile bottom sheet controls; desktop sidebar
// - Only populated sides are captured & uploaded
// - Per-view image/text settings; separate logo upload per view
// - Upload progress indicator per view; graceful errors
// - Pixel-perfect html-to-image capture with devicePixelRatio

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { toPng } from "html-to-image";
import { MdNavigateNext } from "react-icons/md";
import axios from "axios";
import menstshirt from "../assets/men_s_white_polo_shirt_mockup-removebg-preview.png";
import { createDesign, getproductssingle } from "../Service/APIservice";
import { useParams, useNavigate } from "react-router-dom";

// ------------------- helpers -------------------
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// convert px delta -> % of container
const pxToPct = (px, total) => (total <= 0 ? 0 : (px / total) * 100);

// ------------------- Draggable -------------------
function DraggableItem({ id, children, posPct = { x: 10, y: 10 }, containerSize }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const xPx = (posPct.x / 100) * containerSize.width + (transform?.x || 0);
  const yPx = (posPct.y / 100) * containerSize.height + (transform?.y || 0);

  return (
    <div
      ref={setNodeRef}
      style={{ position: "absolute", transform: `translate3d(${xPx}px, ${yPx}px, 0)`, cursor: "move", zIndex: 20 }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

// ------------------- Component -------------------
export default function TshirtDesigner() {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({}); // {view: percent}
  const [side, setSide] = useState("front");
  const [sideimage, setSideimage] = useState([]);

  const { proid, color } = useParams();
  const navigate = useNavigate();
  const colorWithHash = `#${color}`;

  const views = ["front", "back", "left", "right"];
  const getViewIndex = (s) => ({ front: 0, back: 1, left: 2, right: 3 }[s] ?? 0);

  // Canvas size (responsive). We keep a fixed aspect ratio ~40:38 like original.
  const canvasWrapRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 608 });

  // Resize observer
  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = (38 / 40) * w; // maintain 40:38 ratio
      setCanvasSize({ width: w, height: h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const defaultSideState = (view) => ({
    uploadedImage: null, // base64 for raw logo
    customText: "",
    textSize: 20,
    textColor: "#000000",
    font: "font-sans",
    imageSize: 30, // percent of canvas width for logo sizing
    positions: {
      [`uploaded-image-${view}`]: { x: 20, y: 20 }, // %
      [`custom-text-${view}`]: { x: 20, y: 50 },
    },
  });

  const [allDesigns, setAllDesigns] = useState({
    front: defaultSideState("front"),
    back: defaultSideState("back"),
    left: defaultSideState("left"),
    right: defaultSideState("right"),
  });

  const designRefs = {
    front: useRef(null),
    back: useRef(null),
    left: useRef(null),
    right: useRef(null),
  };

  // Fetch product design side images
  useEffect(() => {
    (async () => {
      try {
        const data = await getproductssingle(proid);
        const match = data?.image_url?.find((e) => e.colorcode === colorWithHash);
        setSideimage(match?.designtshirt || []);
      } catch (e) {
        console.error("Failed to fetch product images", e);
      }
    })();
  }, [proid, colorWithHash]);

  const currentDesign = allDesigns[side];

  // Upload handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setAllDesigns((prev) => ({ ...prev, [side]: { ...prev[side], uploadedImage: reader.result } }));
    reader.readAsDataURL(file);
  };

  const updateCurrentDesign = (property, value) => {
    setAllDesigns((prev) => ({ ...prev, [side]: { ...prev[side], [property]: value } }));
  };

  // Drag end -> persist as % of container
  const handleDragEnd = useCallback(
    (event) => {
      const { active, delta } = event;
      const id = active?.id;
      if (!id) return;
      setAllDesigns((prev) => {
        const pv = prev[side];
        const prevPct = pv.positions[id] || { x: 0, y: 0 };
        const next = { ...prev };
        const dxPct = pxToPct(delta.x, canvasSize.width);
        const dyPct = pxToPct(delta.y, canvasSize.height);
        // Clamp to keep within canvas (roughly; not accounting for element size)
        const x = clamp(prevPct.x + dxPct, 0, 100);
        const y = clamp(prevPct.y + dyPct, 0, 100);
        next[side] = {
          ...pv,
          positions: { ...pv.positions, [id]: { x, y } },
        };
        return next;
      });
    },
    [side, canvasSize.width, canvasSize.height]
  );

  // View has content?
  const viewHasContent = (view) => {
    const d = allDesigns[view];
    return !!(d?.uploadedImage || (d?.customText && d.customText.trim() !== ""));
  };

  // Upload any base64 image to ImageKit
  const uploadToImageKit = async (base64DataUrl, view, isUploadedLogo = false) => {
    if (!base64DataUrl?.startsWith("data:image")) throw new Error("Invalid image data");
    const fileName = `${isUploadedLogo ? "logo" : "tshirt"}_${view}_${Date.now()}.png`;
    const authRes = await axios.get("https://duco-backend.onrender.com/api/imagekit/auth");
    const { signature, expire, token } = authRes.data;

    const formData = new FormData();
    formData.append("file", base64DataUrl);
    formData.append("fileName", fileName);
    formData.append("token", token);
    formData.append("expire", String(expire));
    formData.append("signature", signature);
    formData.append("useUniqueFileName", "true");
    formData.append("folder", "/tshirt-designs");
    formData.append("publicKey", "public_pxbUbZQmz2LGTkhrvGgUMelJZbg=");

    const res = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData, {
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / (e.total || 1));
        setUploadProgress((p) => ({ ...p, [view]: percent }));
      },
    });
    return res.data?.url;
  };

  // Capture only populated views
  const captureSelectedViews = async () => {
    setIsSaving(true);
    setUploadProgress({});
    const out = [];

    for (const view of views) {
      if (!viewHasContent(view)) continue;
      const ref = designRefs[view]?.current;
      if (!ref) continue;

      // temp elevate
      const original = {
        opacity: ref.style.opacity,
        pointerEvents: ref.style.pointerEvents,
        position: ref.style.position,
        zIndex: ref.style.zIndex,
      };
      ref.style.opacity = "1";
      ref.style.pointerEvents = "auto";
      ref.style.position = "relative";
      ref.style.zIndex = "50";

      await new Promise((r) => setTimeout(r, 100));
      const dataUrl = await toPng(ref, { cacheBust: true, pixelRatio: Math.max(2, window.devicePixelRatio || 1) });

      // restore
      ref.style.opacity = original.opacity;
      ref.style.pointerEvents = original.pointerEvents;
      ref.style.position = original.position;
      ref.style.zIndex = original.zIndex;

      if (!dataUrl?.startsWith("data:image")) continue;

      const url = await uploadToImageKit(dataUrl, view);
      const logoBase64 = allDesigns[view]?.uploadedImage || null;
      const logoImageUrl = logoBase64 ? await uploadToImageKit(logoBase64, view, true) : null;

      out.push({ view, url, uploadedImage: logoImageUrl });
    }

    setIsSaving(false);
    return out;
  };

  // Save populated views; embed % positions & text meta
  const saveSelectedViews = async () => {
    try {
      const raw = await captureSelectedViews();
      if (raw.length === 0) return console.warn("Nothing to save");

      const enriched = raw.map((item) => {
        const d = allDesigns[item.view];
        return {
          ...item,
          positions: d?.positions || {}, // % stored
          if_text: {
            customText: d?.customText || "",
            textSize: d?.textSize || 0,
            textColor: d?.textColor || "#000000",
            font: d?.font || "font-sans",
          },
        };
      });

      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      const payload = { ...(user && { user: user._id }), products: proid, design: enriched };
      const result = await createDesign(payload);
      if (result) navigate(-1);
      else console.error("Failed to save design");
    } catch (err) {
      console.error("Failed to save designs:", err);
      setIsSaving(false);
    }
  };

  // -------------- render helpers --------------
  const CanvasLayer = ({ view }) => {
    const design = allDesigns[view];
    const isActive = view === side;
    const src = sideimage[getViewIndex(view)] || menstshirt;

    return (
      <div
        ref={designRefs[view]}
        className={`absolute inset-0 transition-opacity duration-300 ${
          isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <img src={src} alt={`${view} T-shirt`} className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0" />
        <div className="relative w-full h-full z-10">
          {design.uploadedImage && (
            <DraggableItem id={`uploaded-image-${view}`} posPct={design.positions[`uploaded-image-${view}`]} containerSize={canvasSize}>
              <img
                src={design.uploadedImage}
                alt="Uploaded"
                style={{
                  width: `${design.imageSize}%`,
                  height: "auto",
                  maxWidth: "100%",
                }}
                className="object-contain"
              />
            </DraggableItem>
          )}

          {design.customText && (
            <DraggableItem id={`custom-text-${view}`} posPct={design.positions[`custom-text-${view}`]} containerSize={canvasSize}>
              <p className={`select-none ${design.font} font-semibold`} style={{ fontSize: `${design.textSize}px`, color: design.textColor, whiteSpace: "nowrap" }}>
                {design.customText}
              </p>
            </DraggableItem>
          )}
        </div>
      </div>
    );
  };

  const DesktopSidebar = () => (
    <aside className="hidden lg:block w-80 xl:w-96 bg-white rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-4 h-fit">
      <Controls />
    </aside>
  );

  const MobileBottomSheet = () => (
    <div className="lg:hidden fixed bottom-0 inset-x-0 rounded-t-2xl bg-white shadow-2xl border-t border-gray-200">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-800">Editor</div>
          <div className="flex gap-2">
            {views.map((v) => (
              <button key={v} onClick={() => setSide(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium ${side === v ? "bg-yellow-400 text-black" : "bg-gray-900 text-white"}`}>
                {v[0].toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-h-[48vh] overflow-y-auto px-4 pb-20">
        <Controls compact />
      </div>
      <div className="absolute bottom-3 right-4 left-4 flex gap-3">
        <button onClick={saveSelectedViews} className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold flex items-center justify-center gap-1 active:scale-[0.99]">
          Submit <MdNavigateNext />
        </button>
      </div>
    </div>
  );

  const Controls = ({ compact = false }) => (
    <div className={`space-y-5 ${compact ? "" : ""}`}>
      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Upload Logo (per view)</h3>
        <label className="flex flex-col items-center px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-100 cursor-pointer transition-all">
          <svg className="w-6 h-6 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-600">Tap to upload</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {currentDesign.uploadedImage && (
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Logo Size (width %)</h3>
          <input type="range" min="10" max="90" value={currentDesign.imageSize} onChange={(e) => updateCurrentDesign("imageSize", Number(e.target.value))} className="w-full" />
          <span className="text-[11px] text-gray-600">{currentDesign.imageSize}%</span>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Custom Text</h3>
        <input type="text" value={currentDesign.customText} onChange={(e) => updateCurrentDesign("customText", e.target.value)} placeholder="Your slogan here" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Text Size (px)</h3>
          <input type="number" value={currentDesign.textSize} onChange={(e) => updateCurrentDesign("textSize", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Text Color</h3>
          <input type="color" value={currentDesign.textColor} onChange={(e) => updateCurrentDesign("textColor", e.target.value)} className="w-10 h-10 rounded-full cursor-pointer" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Font Style</h3>
        <select onChange={(e) => updateCurrentDesign("font", e.target.value)} value={currentDesign.font} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700">
          <option value="font-sans">Sans - Modern</option>
          <option value="font-serif">Serif - Classic</option>
          <option value="font-mono">Mono - Minimal</option>
        </select>
      </div>

      {!compact && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {views.map((v) => (
              <button key={v} onClick={() => setSide(v)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${side === v ? "bg-yellow-400 text-black" : "bg-gray-900 text-white"}`}>
                {v[0].toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          {sideimage.length > 0 && (
            <div className="flex justify-center">
              <img src={sideimage[getViewIndex(side)]} alt={`${side} view`} className="w-60 h-auto object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  // -------------- Render --------------
  return (
    <>
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[60]">
          <div className="text-white text-base font-semibold bg-gray-800 px-6 py-3 rounded-lg shadow-lg">Saving your design…</div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4">
        {/* Desktop sidebar */}
        <DesktopSidebar />

        {/* Canvas + top actions */}
        <main className="flex-1 flex flex-col items-center">
          {/* Top tabs (desktop) */}
          <div className="hidden lg:flex justify-center gap-2 mb-3">
            {views.map((v) => (
              <button key={v} onClick={() => setSide(v)} className={`px-4 py-2 rounded-md text-sm font-medium ${side === v ? "bg-yellow-400 text-black" : "bg-gray-900 text-white"}`}>
                {v[0].toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <DndContext onDragEnd={handleDragEnd}>
            {/* Aspect-ratio wrapper — scales with width */}
            <div ref={canvasWrapRef} className="relative w-full max-w-[min(92vw,820px)] aspect-[40/38] rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-200">
              {views.map((v) => (
                <CanvasLayer key={v} view={v} />
              ))}

              {/* Floating Submit (desktop/tablet) */}
              <button onClick={saveSelectedViews} className="hidden lg:flex absolute bottom-4 right-4 py-2 px-5 items-center justify-center bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md">
                Submit <MdNavigateNext />
              </button>

              {/* Upload progress badge per active view */}
              {uploadProgress[side] != null && (
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  Upload {side}: {uploadProgress[side]}%
                </div>
              )}
            </div>
          </DndContext>
        </main>
      </div>

      {/* Mobile bottom sheet controls */}
      <MobileBottomSheet />
    </>
  );
}
