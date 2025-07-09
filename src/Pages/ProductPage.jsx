import React, { useState } from 'react';
import tshirtImage from '../assets/gloomy-young-black-model-clean-white-unlabeled-cotton-t-shirt-removebg-preview.png';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlinePrint, MdOutlineColorLens, MdOutlineStraighten } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedSize, setSelectedSize] = useState('M');
  const navigate = useNavigate()

  const colors = [
    '#E3C099', '#4C2A2A', '#8D5A5A', '#3B3B3B', '#007F5F', '#FC5185', '#9ED8DB', '#FFD700',
    '#F08080', '#00FA9A', '#E6E6FA', '#F0E68C', '#F5F5F5', '#FF4500', '#D8BFD8', '#B0E0E6',
    '#D2B48C', '#C0C0C0', '#8A2BE2', '#483D8B', '#2F4F4F', '#B22222'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'];

  return (
    <section className=" p-6 text-white ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8  mt-8">
        {/* Left - Images */}
        <div className='h-auto'>
         <img src={tshirtImage} alt="T-Shirt" className="w-full   sm:h-[52%] max-w-[500px] md:max-w-full object-contain rounded-xl   bg-white shadow-md" />
          <div className="flex gap-2 mt-4">
            {[...Array(5)].map((_, idx) => (
              <img
                key={idx}
                src={tshirtImage}
                alt="Thumbnail"
                className="w-16 h-16 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>

        {/* Right - Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-[#E5C870]">Unisex Classic Crew T-Shirt | UC21</h1>
          <p className="text-2xl font-semibold">₹160.00</p>

          <button onClick={()=> navigate("/getbulk")}  className="bg-[#E5C870] hover:bg-green-600 text-black  font-bold px-4 py-2 rounded">Get Your Free Bulk Quote</button>

          <ul className="grid grid-cols-2 gap-1 text-sm text-gray-700">
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
              {['DTG', 'DTF', 'Vinyl', 'Embroidery'].map((opt) => (
                <button key={opt} className="border px-4 py-1 rounded hover:bg-green-600">{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlineColorLens /> Available Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MdOutlineStraighten /> Available Sizes
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded ${selectedSize === size ? 'bg-black text-white' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="bg-[#E5C870] hover:bg-green-600 text-black w-full text-xl font-bold py-3 rounded">Start Buying</button>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
