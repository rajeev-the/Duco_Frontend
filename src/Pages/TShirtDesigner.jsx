// FULL MULTI-VIEW DESIGNER — saves only populated sides, embedding positions + if_text per view

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { MdNavigateNext } from 'react-icons/md';
import menstshirt from "../assets/men_s_white_polo_shirt_mockup-removebg-preview.png";
import axios from 'axios';
import { createDesign, getproductssingle } from '../Service/APIservice';
import { useParams, useNavigate } from 'react-router-dom';

const DraggableItem = ({ id, children, position = { x: 0, y: 0 } }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    position: 'absolute',
    transform: transform
      ? `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    cursor: 'move',
    zIndex: 20,
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const TshirtDesigner = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [side, setSide] = useState('front');
  const [sideimage, setSideimage] = useState([]);

  const views = ['front', 'back', 'left', 'right'];

  const defaultSideState = (view) => ({
    uploadedImage: null,
    customText: '',
    textSize: 20,
    textColor: '#000000',
    font: 'font-sans',
    imageSize: 120,
    positions: {
      [`uploaded-image-${view}`]: { x: 50, y: 50 },
      [`custom-text-${view}`]: { x: 50, y: 100 },
    }
  });

  const [allDesigns, setAllDesigns] = useState({
    front: defaultSideState('front'),
    back: defaultSideState('back'),
    left: defaultSideState('left'),
    right: defaultSideState('right')
  });

  const designRefs = {
    front: useRef(null),
    back: useRef(null),
    left: useRef(null),
    right: useRef(null)
  };

  const { proid, color } = useParams();
  const navigate = useNavigate();
  const colorWithHash = `#${color}`;

  const getViewIndex = (s) => {
    const map = { front: 0, back: 1, left: 2, right: 3 };
    return map[s] ?? 0;
  };

  useEffect(() => {
    const getdata = async () => {
      try {
        const data = await getproductssingle(proid);
        const match = data?.image_url?.find((e) => e.colorcode === colorWithHash);
        setSideimage(match?.designtshirt || []);
      } catch (e) {
        console.error('Failed to fetch product images', e);
      }
    };
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proid, color]);

  const currentDesign = allDesigns[side];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAllDesigns(prev => ({
        ...prev,
        [side]: { ...prev[side], uploadedImage: reader.result }
      }));
    };
    reader.readAsDataURL(file);
  };

  const updateCurrentDesign = (property, value) => {
    setAllDesigns(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [property]: value
      }
    }));
  };

  const handleDragEnd = useCallback((event) => {
    const { active, delta } = event;
    const id = active.id;
    setAllDesigns(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        positions: {
          ...prev[side].positions,
          [id]: {
            x: (prev[side].positions[id]?.x || 0) + delta.x,
            y: (prev[side].positions[id]?.y || 0) + delta.y
          }
        }
      }
    }));
  }, [side]);

  // A view is "non-empty" if it has an uploaded image OR non-empty text
  const viewHasContent = (view) => {
    const d = allDesigns[view];
    return !!(d?.uploadedImage || (d?.customText && d.customText.trim() !== ''));
  };

  // Upload any base64 image (rendered design or raw logo) to ImageKit
  const uploadToImageKit = async (base64DataUrl, view, isUploadedLogo = false) => {
    if (!base64DataUrl || !base64DataUrl.startsWith("data:image")) {
      throw new Error("Image data is missing or invalid.");
    }

    const fileName = `${isUploadedLogo ? 'logo' : 'tshirt'}_${view}_${Date.now()}.png`;
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
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(prev => ({ ...prev, [view]: percent }));
      }
    });

    return res.data?.url;
  };

  // Capture ONLY views with content and upload them
  const captureSelectedViews = async () => {
    setIsSaving(true);
    setUploadProgress({});
    const result = [];

    for (const view of views) {
      if (!viewHasContent(view)) continue;

      const ref = designRefs[view]?.current;
      if (!ref) continue;

      // Ensure visibility for capture
      const original = {
        opacity: ref.style.opacity,
        pointerEvents: ref.style.pointerEvents,
        position: ref.style.position,
        zIndex: ref.style.zIndex,
      };
      ref.style.opacity = '1';
      ref.style.pointerEvents = 'auto';
      ref.style.position = 'relative';
      ref.style.zIndex = '50';

      await new Promise((r) => setTimeout(r, 120));
      const dataUrl = await toPng(ref, { cacheBust: true, pixelRatio: 2 });

      // Restore original styles
      ref.style.opacity = original.opacity;
      ref.style.pointerEvents = original.pointerEvents;
      ref.style.position = original.position;
      ref.style.zIndex = original.zIndex;

      if (!dataUrl?.startsWith("data:image")) continue;

      const url = await uploadToImageKit(dataUrl, view);

      // Optional: upload the raw logo for this view as a separate asset
      const logoBase64 = allDesigns[view]?.uploadedImage || null;
      const logoImageUrl = logoBase64
        ? await uploadToImageKit(logoBase64, view, true)
        : null;

      result.push({ view, url, uploadedImage: logoImageUrl });
    }

    setIsSaving(false);
    return result;
  };

  // Save ONLY populated views; embed positions + if_text inside each design item
  const saveSelectedViews = async () => {
    try {
      const designArrayRaw = await captureSelectedViews();
      if (designArrayRaw.length === 0) {
        console.warn('No views have content to save.');
        return;
      }

      const designArrayWithDetails = designArrayRaw.map(item => {
        const d = allDesigns[item.view];
        return {
          ...item,
          positions: d?.positions || {},
          if_text: {
            customText: d?.customText || "",
            textSize: d?.textSize || 0,
            textColor: d?.textColor || "#000000",
            font: d?.font || "font-sans"
          }
        };
      });

      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;

      const payload = {
        ...(user && { user: user._id }),
        products: proid,
        design: designArrayWithDetails
      };

      const result = await createDesign(payload);
      if (result) navigate(-1);
      else console.log('Failed to save design.');
    } catch (err) {
      console.error('Failed to save designs:', err);
      setIsSaving(false);
    }
  };

  const renderDesignArea = (view) => {
    const design = allDesigns[view];
    const isActive = view === side;
    return (
      <div
        ref={designRefs[view]}
        className={`absolute top-0 left-0 w-[40rem] h-[38rem]  transition-opacity duration-300 ${
          isActive ? 'relative z-10 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img
          src={sideimage[getViewIndex(view)] || menstshirt}
          alt={`${view} T-shirt`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />
        <div className="relative w-full h-full z-10">
          {design.uploadedImage && (
            <DraggableItem id={`uploaded-image-${view}`} position={design.positions[`uploaded-image-${view}`]}>
              <img
                src={design.uploadedImage}
                alt="Uploaded"
                style={{ width: `${design.imageSize}px`, height: `${design.imageSize}px` }}
                className="object-contain"
              />
            </DraggableItem>
          )}
          {design.customText && (
            <DraggableItem id={`custom-text-${view}`} position={design.positions[`custom-text-${view}`]}>
              <p
                className={`select-none ${design.font} font-semibold`}
                style={{ fontSize: `${design.textSize}px`, color: design.textColor, whiteSpace: 'nowrap' }}
              >
                {design.customText}
              </p>
            </DraggableItem>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-semibold bg-gray-800 px-6 py-3 rounded-lg shadow-lg">
            Saving your design...
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row p-4">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 border border-gray-300">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Upload Logo</h3>
              <label className="flex flex-col items-center px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-100 cursor-pointer transition-all">
                <svg className="w-6 h-6 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {currentDesign.uploadedImage && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Logo Size</h3>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={currentDesign.imageSize}
                  onChange={(e) => updateCurrentDesign('imageSize', Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-600">{currentDesign.imageSize}px</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Custom Text</h3>
              <input
                type="text"
                value={currentDesign.customText}
                onChange={(e) => updateCurrentDesign('customText', e.target.value)}
                placeholder="Your slogan here"
                className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Text Size</h3>
                <input
                  type="number"
                  value={currentDesign.textSize}
                  onChange={(e) => updateCurrentDesign('textSize', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Text Color</h3>
                <input
                  type="color"
                  value={currentDesign.textColor}
                  onChange={(e) => updateCurrentDesign('textColor', e.target.value)}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Font Style</h3>
              <select
                onChange={(e) => updateCurrentDesign('font', e.target.value)}
                value={currentDesign.font}
                className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value="font-sans">Sans - Modern</option>
                <option value="font-serif">Serif - Classic</option>
                <option value="font-mono">Mono - Minimal</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center gap-2 mb-4">
                {['front', 'back', 'left', 'right'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSide(view)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      side === view ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                {sideimage.length > 0 && (
                  <img
                    src={sideimage[getViewIndex(side)]}
                    alt={`${side} view`}
                    className="w-64 h-auto object-contain transition-all duration-300"
                  />
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center top-[-150px] relative">
          <DndContext onDragEnd={handleDragEnd}>
            <div className="relative w-[40rem] h-[38rem] rounded-3xl overflow-hidden">
              {views.map((view) => renderDesignArea(view))}
            </div>
          </DndContext>

          <button
            onClick={saveSelectedViews}
            className="absolute bottom-[100px] right-7 py-2 px-5 flex items-center justify-center bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Submit <MdNavigateNext />
          </button>
        </main>
      </div>
    </>
  );
};

export default TshirtDesigner;

