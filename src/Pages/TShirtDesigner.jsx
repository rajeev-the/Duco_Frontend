import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { MdNavigateNext } from 'react-icons/md';
import mentshirt from "../assets/men_s_white_polo_shirt_mockup-removebg-preview.png";
import axios from 'axios';
import { createDesign } from '../Service/APIservice'; // Adjust the import path as necessary
import { useParams ,useNavigate } from 'react-router-dom';

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

const TshirtDesigner = ({}) => {
  const [shirtColor, setShirtColor] = useState('#000000');
  const [uploadedImage, setUploadedImage] = useState(null);
    const [imageKitUrl, setImageKitUrl] = useState(null); // 💾 Image URL state
  const [imageSize, setImageSize] = useState(120);
  const [isSaving, setIsSaving] = useState(false);
  const [customText, setCustomText] = useState('');
  const [textSize, setTextSize] = useState(20);
  const [textColor, setTextColor] = useState('#000000');
  const [font, setFont] = useState('font-sans');
  const [side, setSide] = useState('front');
  const [positions, setPositions] = useState({
    'uploaded-image': { x: 50, y: 50 },
    'custom-text': { x: 50, y: 100 }
  });
  const designRef = useRef(null);
  const navigate = useNavigate();

const {proid} = useParams();


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDragEnd = useCallback((event) => {
    const { active, delta } = event;
    setPositions(prev => ({
      ...prev,
      [active.id]: {
        x: (prev[active.id]?.x || 0) + delta.x,
        y: (prev[active.id]?.y || 0) + delta.y
      }
    }));
  }, []);

const uploadToImageKit = async (base64DataUrl) => {
  try {
    setIsSaving(true); // Start loader
    const file = base64DataUrl.split(',')[1]; // ✅ Remove base64 prefix
    const fileName = `tshirt_design_${Date.now()}.png`;

    // ✅ STEP 1: Get Signature Auth
    const authRes = await axios.get("https://duco-backend.onrender.com/api/imagekit/auth");
    const { signature, expire, token } = authRes.data;

   

    // ✅ STEP 2: Construct FormData
    const formData = new FormData();
    formData.append("file", file); // base64 (no prefix)
    formData.append("fileName", fileName);
    formData.append("token", token);
    formData.append("expire", expire.toString());
    formData.append("signature", signature);
    formData.append("folder", "/tshirt-designs");
    formData.append("useUniqueFileName", "true");
     formData.append('publicKey', 'public_pxbUbZQmz2LGTkhrvGgUMelJZbg=');

    // ✅ STEP 3: Upload
    const res = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData);
         
   const uploadedUrl = res.data?.url;
setImageKitUrl(uploadedUrl);
console.log("ImageKit upload successful:", uploadedUrl,imageKitUrl); // ✅ Logs actual URL string
await handleSaveDesign(uploadedUrl); // ✅ Pass the actual URL string
  
  } catch (err) {
    console.error("ImageKit upload failed:", err.response?.data || err.message);
    console.log("Upload failed. Check console for details.");
  }
};

const handleSaveDesign = async (uploadedUrl) => {
  const stored = localStorage.getItem('user');
  if (!stored) return;

  

  const user = JSON.parse(stored);
  const designElements = [];

  if (uploadedUrl) {
    designElements.push({
      type: 'image',
      url: uploadedUrl,
      position: positions['uploaded-image'],
      size: imageSize
    });
  }

  if (customText) {
    designElements.push({
      type: 'text',
      text: customText,
      x: positions['custom-text'].x,
      y: positions['custom-text'].y,
      font,
      fontSize: textSize,
      color: textColor
    });
  }


  const payload = {
    user: user._id,
    cutomerprodcuts: proid, // ensure this matches backend field name
    design:designElements
  };

  const result = await createDesign(payload);

  setIsSaving(false); // End loader

  if (result) {
   
    console.log('Saved Design:', result);
    navigate(`/cart`); // Redirect to product page
  } else {
    alert('Failed to save design.');
  }
};




  const downloadDesign = async () => {
  if (!designRef.current) return;

  try {
    const dataUrl = await toPng(designRef.current, { cacheBust: true });

    // Upload to ImageKit
    await uploadToImageKit(dataUrl);
  } catch (err) {
    console.error('Failed to export or upload:', err);
  }
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

      <header className="text-center py-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md">
        <h1 className="text-4xl font-bold tracking-wide">Premium T-Shirt Designer</h1>
      </header>

      <div className="flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-3 min-h-screen gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 border border-gray-300">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Background Color</h3>
              <div className="flex items-center gap-2">
                <input type="color" value={shirtColor} onChange={(e) => setShirtColor(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer" />
                <span className="text-xs text-gray-600 font-mono">{shirtColor.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Upload Logo</h3>
              <label className="flex flex-col items-center px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-100 cursor-pointer transition-all">
                <svg className="w-6 h-6 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600">Click to upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {uploadedImage && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Logo Size</h3>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={imageSize}
                  onChange={(e) => setImageSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-600">{imageSize}px</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Custom Text</h3>
              <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Your slogan here" className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Text Size</h3>
                <input type="number" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Text Color</h3>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Font Style</h3>
              <select onChange={(e) => setFont(e.target.value)} value={font} className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-700">
                <option value="font-sans">Sans - Modern</option>
                <option value="font-serif">Serif - Classic</option>
                <option value="font-mono">Mono - Minimal</option>
              </select>
            </div>

            <button onClick={() => setSide(side === 'front' ? 'back' : 'front')} className="w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all">
              View {side === 'front' ? 'Back' : 'Front'}
            </button>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 sm:mb-[200px] flex items-center justify-center relative">
          <DndContext onDragEnd={handleDragEnd}>
            <div ref={designRef} className="relative w-[38rem] h-[35rem] bg-white rounded-3xl  shadow-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: shirtColor }}>
              <img src={mentshirt} alt="T-shirt" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0" />

              <div className="relative w-full h-full z-10">
                {uploadedImage && (
                  <DraggableItem id="uploaded-image" position={positions['uploaded-image']}>
                    <img src={uploadedImage} alt="Uploaded" style={{ width: `${imageSize}px`, height: `${imageSize}px` }} className="object-contain" />
                  </DraggableItem>
                )}

                {customText && (
                  <DraggableItem id="custom-text" position={positions['custom-text']}>
                    <p className={`select-none ${font} font-semibold`} style={{ fontSize: `${textSize}px`, color: textColor }}>
                      {customText}
                    </p>
                  </DraggableItem>
                )}
              </div>

              <div className="absolute bottom-4 right-4 text-xs bg-white px-2 py-1 rounded shadow text-gray-600 z-20 border border-gray-300">
                {side.toUpperCase()} VIEW
              </div>
            </div>
          </DndContext>

          <button onClick={downloadDesign} className="flex justify-center items-center gap-2 absolute bottom-4 right-0 lg:right-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all">
            Next <MdNavigateNext />
          </button>
        </main>
      </div>
    </>
  );
};

export default TshirtDesigner;
