import React from 'react';
import watchphoto from '../assets/gloomy-young-black-model-clean-white-unlabeled-cotton-t-shirt-removebg-preview.png';

const OrderCart = ({ 
  image = watchphoto, 
  title = "Delivery pending", 
  estimatedDelivery = "May 20, 2025" 
}) => {
  
  const statusInfo = {
    "Delivery pending": {
      color: "text-amber-600",
      progress: "w-1/3",
      barColor: "bg-green-500"
    },
    "Delivery Accepted": {
      color: "text-emerald-600",
      progress: "w-2/3",
      barColor: "bg-emerald-500"
    },
    "Delivery Cancelled": {
      color: "text-rose-600",
      progress: "w-full",
      barColor: "bg-rose-500"
    }
  };

  const { color, progress, barColor } = statusInfo[title] || {
    color: "text-slate-500",
    progress: "w-1/4",
    barColor: "bg-slate-400"
  };

  return (
    <div className="flex flex-col    sm:flex-row items-center sm:items-center gap-4 bg-[#E5C870] rounded-xl p-5 shadow-sm  w-full max-w-3xl transition-all duration-300 hover:shadow-md hover:border-slate-200">
      
      {/* Image Container */}
      <div className="w-24 h-24     sm:w-28 sm:h-28  shrink-0">
        <img 
          src={image} 
          alt="Product" 
          className="w-full bg-white    h-full rounded-lg object-cover border border-slate-100" 
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow w-full space-y-3">
        <div className="flex justify-between items-start">
          {/* Status and Product Info */}
          <div className="space-y-1">
            <span className={`text-sm font-medium tracking-wide uppercase ${color}`}>
              {title}
            </span>
            <h2 className="text-slate-800 font-semibold sm:text-base  text-sm  ">
              Noise Icon '2.1' Display with Bluetooth Calling
            </h2>
            <p className="sm:text-sm  text-[12px] text-slate-400">
              Est. delivery: {estimatedDelivery}
            </p>
          </div>

          {/* Action Button */}
          {title !== "Delivery Cancelled" && (
            <button className="mt-1 text-sm font-medium text-rose-600 hover:text-rose-700 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors">
              Cancel
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${barColor} ${progress} transition-all duration-500 ease-out`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCart;