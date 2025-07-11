import QuantityControls from "./QuantityControls";
import PriceDisplay from "./PriceDisplay";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex gap-4">
        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2" >
            {item.name}
          </h2>
          
          <PriceDisplay price={item.price} className="text-lg font-bold mb-2" />

          <div className="flex gap-4 mb-3">
           <div>
     
        <StarRating rating={item.rating} />
      </div>
          </div>

          <div className="flex items-center gap-4">
            <QuantityControls
              quantity={item.quantity}
              onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            />
            
            <button 
  onClick={() => removeItem(item.id)}
  className="flex items-center gap-2 px-3 py-1.5 rounded-md transition-all 
             hover:bg-red-50 group"
>
  <svg 
    className="w-4 h-4 transition-colors"
   
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16m-4 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
  
  <span 
    className="text-sm font-medium transition-colors"
    
  >
    Remove
  </span>
</button>
          </div>
        </div>
      </div>
    </div>
  );
};
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${index < fullStars ? 'text-[#FDC305]' : 'text-white opacity-40'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {index < fullStars ? (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          ) : (
            <path
              stroke="#112430"
              strokeWidth="0.5"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={hasHalfStar && index === fullStars ? 'url(#half)' : 'transparent'}
            />
          )}
        </svg>
      ))}
    </div>
  );
};

export default CartItem;