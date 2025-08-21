import React, { useState } from 'react';
import PaymentButton from '../Components/PaymentButton'; // Import the component
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayNow, setShowPayNow] = useState(false);
  const [netbankingType,setNetbankingType] = useState("")
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
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center text-[#0A0A0A] mb-6">Select Payment Method</h1>

        <div className="space-y-4">
          {/* Radio: COD */}
        
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
          
           {/* Replace your existing COD block with this */}
<div>
  <label className="flex items-start gap-3 text-lg text-[#0A0A0A]">
    <input
      type="radio"
      name="paymentMethod"
      value="netbanking"
      checked={paymentMethod === "netbanking"}
      onChange={() => handlePaymentChange("netbanking")}
      className="mt-1"
    />
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Netbanking</span>

        {/* Inline dropdown for UPI / Account Details */}
        <select
          value={netbankingType}
          onChange={(e) => setNetbankingType(e.target.value)}
          className="ml-3 rounded-lg border border-gray-300 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E5C870]"
        >
          <option value="upi">UPI</option>
          <option value="bank">Account Details</option>
        </select>
      </div>

      {/* Details panel (only shows when Netbanking is selected) */}
      {paymentMethod === "netbanking" && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
          {netbankingType === "upi" ? (
            <div className="space-y-2 text-sm">
              <div className="font-medium text-[#0A0A0A]">Pay via UPI</div>
              <div className="  grid-cols-2 space-y-2  gap-2">
                <CopyRow label="Primary UPI ID" value="webdesino@upi" />
                <CopyRow label="Backup UPI ID" value="ambassadorperk@okicici" />
              </div>
              {/* Optional QR section (drop in your QR image URL) */}
              {/* <div className="pt-2">
                <img src="/your-qr.png" alt="UPI QR" className="h-36 w-36 rounded-lg border" />
              </div> */}
              <p className="text-gray-500">
                Use any UPI app (GPay/PhonePe/Paytm). Add your order ID in the notes.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="font-medium text-[#0A0A0A]">Bank Transfer Details</div>
              <DetailRow label="Account Name" value="WebDesino Pvt. Ltd." />
              <DetailRow label="Bank Name" value="HDFC Bank" />
              <DetailRow label="Account Number" value="1234 5678 9012" canCopy />
              <DetailRow label="IFSC" value="HDFC0001234" canCopy />
              <DetailRow label="Branch" value="Uttam Nagar, New Delhi" />
              <p className="text-gray-500">
                After transfer, upload the receipt on the order confirmation page. Payments are verified within 1–3 hours.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
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
function DetailRow({ label, value, canCopy }) {
  const copy = () => navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <div className="text-sm">
        <div className="text-gray-500">{label}</div>
        <div className="font-medium text-[#0A0A0A]">{value}</div>
      </div>
      {canCopy && (
        <button
          type="button"
          onClick={copy}
          className="ml-3 rounded-lg border px-2 py-1 text-xs hover:bg-[#E5C870] hover:text-black"
          title="Copy"
        >
          Copy
        </button>
      )}
    </div>
  );
}
function CopyRow({ label, value }) {
  const copy = () => navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2">
      <div>
        <div className="text-gray-500">{label}</div>
        <div className="font-medium text-[#0A0A0A]">{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="ml-3 rounded-lg border px-2 py-1 text-xs hover:bg-[#E5C870] hover:text-black"
        title="Copy"
      >
        Copy
      </button>
    </div>
  );
}

export default PaymentPage;


