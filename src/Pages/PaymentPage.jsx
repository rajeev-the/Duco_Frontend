import React, { useState } from 'react';
import PaymentButton from '../Components/PaymentButton'; // Import the component
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayNow, setShowPayNow] = useState(false);
  const locations = useLocation();
 
   const orderpayload = locations.state


  
  const orderData = {
    totalAmount: 1, // in INR
    items: [
      { name: 'T-shirt', qty: 1, price: 999 },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123, Main Street',
      city: 'Delhi',
      pincode: '110001',
    },
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
    setShowPayNow(method === 'online');
  };

  const handleSubmit = () => {
    if (paymentMethod === 'cod') {
      // ⛳ COD submission logic
      console.log('Cash on Delivery selected');

      // TODO: Call API to place COD order here
      alert('COD Order Placed!');
    } else if (paymentMethod === '') {
      alert('Please select a payment method');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-[#0A0A0A] mb-6">Select Payment Method</h1>

        <div className="space-y-4">
          {/* Radio: COD */}
          <div>
            <label className="flex items-center text-lg text-[#0A0A0A]">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => handlePaymentChange('cod')}
                className="mr-2"
              />
              Cash on Delivery
            </label>
          </div>

          {/* Radio: Online */}
          <div>
            <label className="flex items-center text-lg text-[#0A0A0A]">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => handlePaymentChange('online')}
                className="mr-2"
              />
              Pay Online
            </label>
          </div>

          {/* Buttons */}
          {!showPayNow && (
            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-2 px-4 bg-[#E5C870] text-black rounded-lg hover:bg-[#D4B752] font-semibold"
            >
              Continue
            </button>
          )}

          {showPayNow && (
            <div className="mt-6">
              <PaymentButton orderData={orderpayload} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;


