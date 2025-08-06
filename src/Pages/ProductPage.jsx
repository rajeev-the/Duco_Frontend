import React, { useState, useEffect, useContext } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlinePrint, MdOutlineColorLens, MdOutlineStraighten } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPreviousDesigns, getproductssingle } from '../Service/APIservice';
import DesignPreviewModal from '../Components/DesignPreview';
import { CartContext } from "../ContextAPI/CartContext";
import { usePriceContext } from '../ContextAPI/PriceContext';

const ProductPage = () => {
  const [selectedColorCode, setSelectedColorCode] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
 const { toConvert, priceIncrease  } = usePriceContext();
  const [showModal, setShowModal] = useState(false);
  const [colortext,setColortext] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [product, setProduct] = useState("");
  const [defaultColorGroup, setDefaultColorGroup] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const { addtocart } = useContext(CartContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const[gender,setGender] = useState("")
  const[iscount,setIscount]= useState(0)

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getproductssingle(id);
      if (data) {
        const p = Array.isArray(data) ? data[0] : data;
        setProduct(p);
        setDefaultColorGroup(p.image_url?.[0]);
        setSelectedColorCode(p.image_url?.[0]?.colorcode || '#ffffff');

      }
      console.log(data)
    };
    fetchProduct();
  }, [id]);

  // Load user designs when modal opens
  useEffect(() => {
    const loadDesigns = async () => {
      const stored = localStorage.getItem('user');
      if (!showModal || !stored) return;
      setLoadingDesigns(true);
      const user = JSON.parse(stored);
      const data = await fetchPreviousDesigns(user._id);
      setDesigns(data || []);
      setLoadingDesigns(false);
    };
    loadDesigns();
  }, [showModal]);

  // Handle color change
  const handleColorChange = (colorcode,colortext) => {
    const matched = product?.image_url?.find((c) => c.colorcode === colorcode);
    if (matched) {
      setDefaultColorGroup(matched);
      setSelectedColorCode(colorcode);
      setColortext(colortext)
      setIscount(0)
    }
  }; 

  function calculatePrice(currency, ac, high) {
    const actualPrice = currency*ac
    return  actualPrice + (actualPrice * (high / 100));

}


  return (
    <section className="p-6 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Left - Images */}
        <div className="h-auto">
          <img
            src={defaultColorGroup?.url?.[iscount]}
            alt="T-Shirt"
            className="w-full sm:h-[52%] max-w-[500px] md:max-w-full object-contain rounded-xl bg-white shadow-md"
          />
          <div className="flex gap-2 mt-4">
            {defaultColorGroup?.url?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={()=> setIscount(i)}
                alt="Thumbnail"
                className={`w-16 h-16 object-cover rounded-md  ${iscount == i ? "border-3 border-[#E5C870]  scale-1.5 ":""} `}
              />
            ))}
          </div>
        </div>

        {/* Right - Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-[#E5C870]">{product?.products_name}</h1>
          <p className="text-2xl font-semibold">₹{calculatePrice(toConvert,product?.pricing?.[0]?.price_per,priceIncrease)}</p>

          <button
            onClick={() => navigate("/getbulk")}
            className="bg-[#E5C870] hover:bg-green-600 text-black font-bold px-4 py-2 rounded"
          >
            Get Your Free Bulk Quote
          </button>

          <ul className="grid grid-cols-2 gap-1 text-sm text-white">
            <li><FaCheckCircle className="inline mr-1 text-green-600" />180 GSM</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />100% Cotton</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />Super Combed</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />Pre Shrunk</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />Bio Washed</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />Lycra Ribbed Neck</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />Unisex Regular Fit</li>
            <li><FaCheckCircle className="inline mr-1 text-green-600" />No Minimums</li>
          </ul>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlinePrint /> Printing Options
            </h3>
            <div className="flex gap-4">
              {['DTG', 'DTF', 'Vinyl', ].map((opt) => (
                <button key={opt} className="border px-4 py-1 rounded hover:bg-green-600">{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlineColorLens /> Available Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {product?.image_url?.map((c, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-full border ${selectedColorCode === c.colorcode ? 'ring-2 ring-black' : ''}`}
                  style={{ backgroundColor: c.colorcode }}
                  onClick={() => handleColorChange(c.colorcode,c.color)  }
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlineStraighten /> Available Sizes
            </h3>
            <div className="flex flex-wrap gap-2">
              {defaultColorGroup?.content?.map((s, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 border rounded ${selectedSize === s.size ? 'bg-black text-white' : ''}`}
                  onClick={() => setSelectedSize(s.size)}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#E5C870] hover:bg-green-600 text-black w-full text-xl font-bold py-3 rounded"
          >
            Start Buying
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Choose T-Shirt Type</h2>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => {
                  navigate("/buy-regular");
                  setShowModal(false);
                }}
                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-all"
              >
                Regular T-Shirt
              </button>
              <button
                onClick={() => {
                 navigate(`/design/${id}/${selectedColorCode.replace('#', '')}`);

                  setShowModal(false);
                }}
                className="w-full bg-[#E5C870] text-black py-2 rounded-md hover:bg-green-600 transition-all"
              >
                Design T-Shirt
              </button>
            </div>

            <div className="text-left mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Previous Designs</h3>
              {loadingDesigns ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : designs.length === 0 ? (
                <p className="text-sm text-gray-400">No previous designs found.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {designs.map((d) => (
                    <div
                      key={d._id}
                      onClick={() => setSelectedDesign(d)}
                      className="cursor-pointer border border-gray-300 rounded p-2 hover:bg-gray-100 transition"
                    >
                      <p className="text-sm font-medium">
                        Product ID: <span className="text-gray-800">{d.products?._id || d.cutomerprodcuts}</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        Created: {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <DesignPreviewModal
        selectedDesign={selectedDesign}
        onClose={() => setSelectedDesign(null)}
        id={id}
        addtocart={addtocart}
        size={selectedSize}
        color={selectedColorCode}
        colortext={colortext}
        gender={gender}
      />
    </section>
  );
};

export default ProductPage;
