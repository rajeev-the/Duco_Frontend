import React, { useState, useEffect, useContext } from 'react';
import CartItem from '../Components/CartItem ';
import AddressManager from '../Components/AddressManager';
import Loading from '../Components/Loading';
import { CartContext } from "../ContextAPI/CartContext";
import { getproducts } from "../Service/APIservice";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, clear, removeFromCart, updateQuantity } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate()

  // Get user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const fetched = await getproducts();
      if (fetched) setProducts(fetched);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Combine cart items with full product data
  const actualdata = cart.map((cartItem) => {
    const product = products.find((p) => p._id === cartItem.id);
    if (!product) return null;

    return {
      ...product,
      ...cartItem
    };
  }).filter(Boolean); // remove nulls

  const subtotal = actualdata.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const postage = 24.00;
  const total = subtotal + postage;

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
                key={i}
                item={item}
                removeFromCart={() =>
                  removeFromCart(item.id, item.size, item.color, item.design)
                }
                updateQuantity={(newQty) =>
                  updateQuantity(item.id, item.size, item.color, item.design, newQty)
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
              onClick={ ()=>
                navigator("/payment")
              }
            >
              CHECK OUT
            </button>
          </div>

          <AddressManager user={user} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};

export default Cart;

