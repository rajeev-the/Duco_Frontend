// FULL MULTI-VIEW DESIGNER WITH PROPER POSITIONED SAVING

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

  const getViewIndex = (side) => {
    const map = { front: 0, back: 1, left: 2, right: 3 };
    return map[side] ?? 0;
  };

  useEffect(() => {
    const getdata = async () => {
      const data = await getproductssingle(proid);
      const match = data?.image_url.find((e) => e.colorcode === colorWithHash);
      setSideimage(match?.designtshirt || []);
    };
    getdata();
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

  const uploadToImageKit = async (base64DataUrl, view) => {
    if (!base64DataUrl || !base64DataUrl.startsWith("data:image")) {
      throw new Error("Image data is missing or invalid.");
    }

    const fileName = `tshirt_${view}_${Date.now()}.png`;
    const authRes = await axios.get("https://duco-backend.onrender.com/api/imagekit/auth");
    const { signature, expire, token } = authRes.data;

    const formData = new FormData();
    formData.append("file", base64DataUrl);
    formData.append("fileName", fileName);
    formData.append("token", token);
    formData.append("expire", expire.toString());
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

  const captureAllDesigns = async () => {
    setIsSaving(true);
    setUploadProgress({});
    const designUrls = {};
    for (const view of views) {
      const ref = designRefs[view].current;
      if (!ref) continue;

      const originalStyles = {
        opacity: ref.style.opacity,
        pointerEvents: ref.style.pointerEvents,
        position: ref.style.position,
        zIndex: ref.style.zIndex,
      };

      ref.style.opacity = '1';
      ref.style.pointerEvents = 'auto';
      ref.style.position = 'relative';
      ref.style.zIndex = '50';

      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(ref, { cacheBust: true });

      ref.style.opacity = originalStyles.opacity;
      ref.style.pointerEvents = originalStyles.pointerEvents;
      ref.style.position = originalStyles.position;
      ref.style.zIndex = originalStyles.zIndex;

      if (!dataUrl || !dataUrl.startsWith("data:image")) continue;
      designUrls[view] = await uploadToImageKit(dataUrl, view);
    }
    setIsSaving(false);
    return designUrls;
  };

  const handleSaveDesign = async (designUrls) => {
    const stored = localStorage.getItem('user');
    if (!stored) return;
    const user = JSON.parse(stored);
    const designArray = views.map(view => designUrls[view] || null);
    const payload = {
      user: user._id,
      cutomerprodcuts: proid,
      design: designArray,
      designElements: allDesigns
    };
    const result = await createDesign(payload);
    if (result)  navigate(-1);
    else console.log('Failed to save design.');
  };

  const downloadDesign = async () => {
    try {
      const urls = await captureAllDesigns();
      await handleSaveDesign(urls);
    } catch (err) {
      console.error('Failed to save designs:', err);
    }
  };

  const renderDesignArea = (view) => {
    const design = allDesigns[view];
    const isActive = view === side;
    return (
      <div
        ref={designRefs[view]}
        className={`absolute top-0 left-0 w-[40rem] h-[38rem] bg-white transition-opacity duration-300 ${
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
      {isSaving && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white text-lg font-semibold bg-gray-800 px-6 py-3 rounded-lg shadow-lg">
          Saving your design...
        </div>
      </div>}

      <div className="flex flex-col lg:flex-row p-4">
        {/* Sidebar and Control Panel here (omitted for brevity) */}
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
            onClick={downloadDesign}
            className="absolute bottom-[100px] right-7 py-2 px-5 flex  items-center justify-center bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Submit <MdNavigateNext />
          </button>
        </main>
      </div>
    </>
  );
};

export default TshirtDesigner;


