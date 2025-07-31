import React from "react";
import { useState } from "react";

const AdminCartItem = ({ product, onEdit }) => {

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
        <div className="flex gap-5   justify-items-center   items-center">
       
             <p className="text-gray-500">Stock: </p>
             {/* {product.Stock ? "200": 
                   product.Stock.map((e)=>
                  <div>
                    <p>white</p>
                    <p>20</p>
                  </div>
                  )
             
             } */}
              <div>
                    <p>white</p>
                    <p>20</p>
                  </div>
                   <div>
                    <p>green</p>
                    <p>20</p>
                  </div>
                   <div>
                    <p>red</p>
                    <p>20</p>
                  </div>
            
       
          </div>
          
     
      
        
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit(product.id)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition"
      >
        ✏️ Edit
      </button>
    </div>
  );
};

export default AdminCartItem;
