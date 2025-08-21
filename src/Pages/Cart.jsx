import React, { useState, useEffect, useContext } from 'react';
import CartItem from '../Components/CartItem ';
import AddressManager from '../Components/AddressManager';
import Loading from '../Components/Loading';
import { CartContext } from "../ContextAPI/CartContext";
import { getproducts } from "../Service/APIservice";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { usePriceContext } from '../ContextAPI/PriceContext.jsx'

const Cart = () => {
  const { cart, clear, removeFromCart, updateQuantity } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(null);
  const navigate = useNavigate();
   const { toConvert} = usePriceContext();
  

  // Get user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error('Invalid user in localStorage', e);
    }
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetched = await getproducts();
        if (Array.isArray(fetched)) setProducts(fetched);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load products. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Combine cart items with full product data
  const actualdata = cart
    .map((cartItem) => {
      const product = products.find((p) => p._id === cartItem.id);
      if (!product) return null;
      return { ...product, ...cartItem };
    })
    .filter(Boolean);


  const subtotal = actualdata.reduce((sum, item) => sum + (Number(item?.price || 0) * Number( Object.values(item.quantity).reduce((sum,qty)=> sum+qty,0 ) || 0)), 0);
  const DELIVERY_CHARGE  = 60.00*toConvert;
  const PRINING_CHARGE  = 50*toConvert;
  const PACKING_CHARGE = 50*toConvert; 
  const total = subtotal + DELIVERY_CHARGE + PRINING_CHARGE + PACKING_CHARGE

  const orderPayload = {
         // raw cart payload (ids, size, color, quantity, design)
    items: actualdata,      // enriched items (if you want to see merged data on /payment)
    totalPay: total,
    address:address,
    user:user
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to continue.");
      return;
    }

    if (!actualdata.length) {
      toast.error("Your cart is empty. Add some products first.");
      navigate("/home");
      return;
    }

    if (!address || Object.keys(address || {}).length === 0) {
      toast.error("Please Select delivery address.");
      return;
    }

    navigate("/payment", { state: orderPayload });
  };

  console.log(orderPayload)

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen text-white p-8">
     

      <h1 className="text-3xl font-bold mb-8">SHOPPING CART</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          {actualdata.length > 0 ? (
            actualdata.map((item, i) => (
              <CartItem
                key={`${item._id}-${item.size}-${item.color}-${i}`}
                item={item}
                removeFromCart={() =>
                  removeFromCart(item.id, item.quantity, item.color, item.design)
                }
                updateQuantity={(newQty) =>
                  updateQuantity(item.id, item.quantity, item.color, item.design, newQty)
                }
              />
            ))
          ) : (
            <div className="text-gray-400 text-center mt-16 text-xl">Your cart is empty.</div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 flex flex-col">
          <div className="lg:w-96 h-fit rounded-sm p-6" style={{ backgroundColor: '#112430' }}>
            <h2 className="text-2xl font-bold mb-6 text-white">ORDER SUMMARY</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white">{subtotal.toFixed(2).replace('.', '.')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Delivery Charge</span>
                <span className="text-white">{DELIVERY_CHARGE.toFixed(2).replace('.', '.')}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-gray-300">Packing Charge</span>
                <span className="text-white">{PACKING_CHARGE.toFixed(2).replace('.', '.')}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-gray-300">Printing Charge</span>
                <span className="text-white">{PRINING_CHARGE.toFixed(2).replace('.', '.')}</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-600 pt-4 mb-6">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold">{total.toFixed(2).replace('.', '.')}</span>
            </div>

            <button
              className="w-full py-4 font-bold hover:bg-opacity-90 transition-all"
              style={{ backgroundColor: '#FDC305', color: '#112430' }}
              onClick={handleCheckout}
            >
              CHECK OUT
            </button>
          </div>

          {/* Pass setAddress (fixed prop name) */}
          <AddressManager  addresss={address} setAddresss={setAddress} user={user} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
