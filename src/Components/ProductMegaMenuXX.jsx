import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getSubcategoriesByCategoryId } from '../Service/APIservice';
import * as FaIcons from "react-icons/fa";
import Loading from './Loading';

const ProductMegaMenuXX = () => {
  const [icons, setIcons] = useState('');
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoriesdummy = [
    "Men's Clothing",
    "Women's Clothing",
    "Kid's Clothing"
  ];

  const IconRenderer = ({ iconName, size = 24, color = "#000" }) => {
    const IconComponent = FaIcons[iconName];
    if (!IconComponent) return <span>Invalid Icon</span>;
    return <IconComponent size={size} color={color} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getCategories();
      if (data && data.length) {
        setCategories(data);
        const data1 = await getSubcategoriesByCategoryId(data[0]?._id);
        setValue(data1);
        setIcons(data[0]?.icons);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleclickingsub = async (id, isDummy = false) => {
    if (isDummy) return;
    setLoading(true);
    const data = await getSubcategoriesByCategoryId(id);
    setValue(data);
    setLoading(false);
  };

  const categoriesToRender = categories.length ? categories : categoriesdummy;

  return (
    <div className="w-[700px] h-[180px] bg-white/90 backdrop-blur-md shadow-xl rounded-lg border border-gray-200 p-5 flex gap-6 z-50">
      {/* Left: Category List */}
      <div className="w-1/3 border-r pr-4 overflow-y-auto">
        <ul className="space-y-3">
          {categoriesToRender.map((cat, i) => (
            <li
              key={i}
              onClick={() => {
                if (categories.length) {
                  handleclickingsub(cat._id);
                  setIcons(cat?.icons);
                } else {
                  handleclickingsub(null, true); // prevent API call on dummy
                }
              }}
              className="text-[15px] text-[#0A0A0A] font-medium hover:font-bold flex items-center justify-between cursor-pointer"
            >
              <span>{categories.length ? cat.category : cat}</span>
              <span className="text-xl">›</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Featured Products */}
      <div className="w-2/3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#0A0A0A] flex items-center gap-2">
            All Products
            {icons && <IconRenderer iconName={icons.trim()} />}
          </h3>
          <Link
            to="/products/new"
            className="text-sm font-medium text-black hover:underline"
          >
            View All ›
          </Link>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 gap-4 overflow-y-auto">
            {value.map((item, idx) => (
              <Link
                to={`/products/subcategory/${item._id}/${item.subcatogry}`}
                key={idx}
                className="bg-[#E5C870] hover:shadow-md rounded-lg overflow-hidden p-2 text-center transition-all"
              >
                <p className="text-sm font-medium text-black truncate">
                  {item.subcatogry}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMegaMenuXX;
