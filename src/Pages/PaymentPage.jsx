import React, { useState } from 'react';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = () => {
    // Handle the submission logic here
    if (paymentMethod === 'cod') {
      console.log('Cash on Delivery selected');
    } else if (paymentMethod === 'online') {
      console.log('Pay Online selected');
    } else {
      console.log('Please select a payment method');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-[#0A0A0A] mb-6">Select Payment Method</h1>

        <div className="space-y-4">
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

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-2 px-4 bg-[#E5C870] text-white rounded-lg hover:bg-[#D4B752]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

