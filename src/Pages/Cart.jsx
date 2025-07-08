import React,{useState} from 'react'
import CartItem from '../Components/CartItem ';
import watchphoto from '../assets/gloomy-young-black-model-clean-white-unlabeled-cotton-t-shirt-removebg-preview.png'

const Cart = () => {
   const [items, setItems] = useState([
    {
      id: 1,
      name: "Noise Icon '2.1' Display with Bluetooth Calling",
      price: 1150.00,
      size: 36,
      color: "WHITE",
      quantity: 1,
      image: watchphoto,
       rating: 4.5
    },
    {
      id: 2,
      name: " Noise Icon '2.1' Display with Bluetooth Calling            ",
      price: 1250.00,
      size: 36,
      color: "BLACK",
      quantity: 3,
      image: watchphoto,
       rating: 4.5
      

    },
    {
      id: 3,
      name: "GAMILLE HENROT ARTWORK TOP",
      price: 495.00,
      size: 36,
      color: "BLACK",
      quantity: 2,
      image: watchphoto,
       rating: 4.5
    }
  ]);

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const postage = 24.00;
  const total = subtotal + postage;

  return (
    <div className="min-h-screen  text-white p-8" >
      <h1 className="   text-3xl font-bold mb-8" >SHOPPING CART</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex-1">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}
        </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96   h-fit   rounded-sm  p-6" style={{ backgroundColor: '#112430' }}>
          <h2 className="text-2xl font-bold mb-6 text-white">ORDER SUMMARY</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white">€{subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Shipping</span>
              <span className="text-white">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Postage</span>
              <span className="text-white">€{postage.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-600 pt-4 mb-6">
            <span className="text-white font-bold">Total</span>
            <span className="text-white font-bold">€{total.toFixed(2).replace('.', ',')}</span>
          </div>

          <button 
            className="w-full py-4 font-bold hover:bg-opacity-90 transition-all"
            style={{ backgroundColor: '#FDC305', color: '#112430' }}
          >
            CHECK OUT
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart



