import React, { useState, useEffect, useContext } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlinePrint, MdOutlineColorLens, MdOutlineStraighten } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPreviousDesigns, getproductssingle ,fetchPreviousDesignswithpreoduts} from '../Service/APIservice';
import DesignPreviewModal from '../Components/DesignPreview';
import { CartContext } from "../ContextAPI/CartContext";
import { usePriceContext } from '../ContextAPI/PriceContext';
import Zoom from 'react-medium-image-zoom';
import { toast } from "react-toastify";
import 'react-medium-image-zoom/dist/styles.css';
import { useOutletContext } from 'react-router-dom';
import PriceTiers from '../Components/PriceTiers';
import CropTanksTabs from '../Components/CropTanksTabs';
import CropTankSizeChart from '../Components/CropTankSizeChart';


function useLayoutCtx() {
  return useOutletContext(); // { setIsOpenLog, isLogin, setIsLogin, login, user }
}
const PRICE_TIERS = [
  { range: "1", price: 510 },
  { range: "2 - 4", price: 467 },
  { range: "5 - 10", price: 408, recommended: true },
  { range: "11 - 20", price: 380 },
  { range: "21 - 50", price: 371 },
];

const ProductPage = () => {
    const { setIsOpenLog } = useLayoutCtx();
  const [selectedColorCode, setSelectedColorCode] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const[price,setPrice] = useState(0)
  const[print,setPrint] = useState("")

   const stored = localStorage.getItem('user');
    const user = JSON.parse(stored);
 const { toConvert, priceIncrease ,setLocation } = usePriceContext();
  const [showModal, setShowModal] = useState(false);
  const [colortext,setColortext] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [product, setProduct] = useState();
  const [defaultColorGroup, setDefaultColorGroup] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const { addtocart } = useContext(CartContext);
  const { id } = useParams();
    const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
  const initialQty = SIZES.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
  const navigate = useNavigate();
  const [qty, setQty] = useState(initialQty);
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
        setColortext(p.image_url?.[0]?.color)
         setPrice(calculatePrice(toConvert,p?.pricing?.[0]?.price_per,priceIncrease))
         setGender(p.gender)

      }
      if(!priceIncrease){
        navigate("/")
      }
      
    };
    fetchProduct();
  }, [id]);




  // ✨ Just works out of the box!



 

  // Load user designs when modal opens
  useEffect(() => {
    const loadDesigns = async () => {
     
      if (!stored) return;
      setLoadingDesigns(true);
     
      const data = await fetchPreviousDesignswithpreoduts(user._id,id);
      setDesigns(data || []);
      setLoadingDesigns(false);
     
    };
    loadDesigns();
  }, [id]);

  // Handle color change
  const handleColorChange = (colorcode,colortext) => {
    const matched = product?.image_url?.find((c) => c.colorcode === colorcode);
        console.log(colortext)
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

const handleQty = (k, v) => {
  const n = Math.max(0, Math.min(9999, Number(v.replace(/[^0-9]/g, "")) || 0));
  setQty((p) => ({ ...p, [k]: n }));
};



  return (
    <section className="p-6 text-white ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Left - Images */}
        <div className="h-auto">
          {/* <ImageMagnifier
      src=
      zoom={2.5}        // tweak as you like
      lensSize={160}    // tweak lens size
    /> */}
   <Zoom>
  <img className='bg-white w-full sm:h-[600px] max-w-[500px] md:max-w-full   object-contain shadow-md overflow-hidden   rounded-2xl' src={defaultColorGroup?.url?.[iscount] ?? ''} alt="Product" />
</Zoom>
 
  

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
          <p className="text-2xl font-semibold">₹{price}</p>

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

          {/* <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlinePrint /> Printing Options
            </h3>
            <div className="flex gap-4">
              {['DTG', 'DTF', 'Vinyl', ].map((opt) => (
                <button onClick={()=>setPrint(opt)} key={opt} className={`border px-4 py-1 rounded ${print == opt ? "bg-green-600":""} `} >{opt}</button>
              ))}
            </div>
          </div> */}

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlineColorLens /> Available Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {product?.image_url?.map((c, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-full border ${selectedColorCode === c.colorcode ? 'ring-2 ring-green-600' : ''}`}
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
          <div className="flex text-white flex-wrap gap-3 mt-2">
  {SIZES.map((s) => (
    <label key={s} className="flex flex-col items-center gap-1">
      <span className="text-sm text-white">{s}</span>
     <input
  type="number"
  inputMode="numeric"
  min={0}
  className="h-12 w-16 rounded-xl border border-slate-300 text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
  value={qty[s] === 0 ? "" : qty[s]}   // 👈 show empty if 0
  onChange={(e) => handleQty(s, e.target.value)}
  placeholder="0"
/>

    </label>
  ))}
</div>

          </div>

          <button
            onClick={() =>{
           
              if(!user){
                  toast.error("Log In / Sign Up")
                  setIsOpenLog(true)
              }
              else{
              
                 addtocart({
                id,
                design:[],
                color:selectedColorCode,
                quantity: qty,
                colortext,
                price: price,
                gender
                 })
                 setShowModal(false);
                 navigate("/cart")
                }}
     
          
            }
            className="bg-[#E5C870] hover:bg-green-600 text-black w-full text-xl font-bold py-3 rounded"
          >
            Start Buying
          </button>
           
        </div>
       

      </div>
       <PriceTiers tiers={PRICE_TIERS} currencySymbol="₹" />
        <CropTankSizeChart/>
       <CropTanksTabs/>
      


    


      

   

    </section>
  );
};

export default ProductPage;
