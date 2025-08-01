import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminCartItem = ({ product }) => {

  const navigtor = useNavigate()
  

  const onEdit= async(id)=>{
 
    navigtor(`/admin/edit/${id}`,{ state: product?.fulldetails })
      
  }

  return (


    <div className="flex items-center justify-between bg-white shadow-md rounded-2xl p-4 mb-4">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.products_name}
        className="w-20 h-20 object-cover rounded-xl border"
      />

      {/* Product Info */}
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{product.products_name}</h3>
       <div className="flex flex-col gap-5">
  {product.image_url?.map((colorItem, colorIndex) => (
    <div
      key={colorItem._id || colorIndex}
      className="flex items-center gap-5 border p-3 rounded-md shadow-sm bg-white"
    >
      <div>
        <p className="font-medium capitalize">{colorItem.color}</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        {colorItem.content.map((sizeItem, sizeIndex) => (
          <div
            key={sizeItem._id || sizeIndex}
            className="border px-3 py-1 rounded bg-gray-100"
          >
            <p className="text-sm text-gray-700 font-semibold">
              Size: {sizeItem.size}
            </p>
            <p className="text-xs text-gray-500">Stock: {sizeItem.minstock}</p>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

          
     
      
        
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(product.id)}
        className="bg-blue-600 hover:bg-blue-700 ml-3 text-white font-medium py-2 px-4 rounded-xl transition"
      >
        ✏️ Edit
      </button>
    </div>
  );
};

export default AdminCartItem;
