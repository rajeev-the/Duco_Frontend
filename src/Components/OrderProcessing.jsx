import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, orderData } = location.state || {};
    const API_BASE = 'https://duco-backend.onrender.com/';
  useEffect(() => {
    if (!paymentId || !orderData) {
      navigate('/'); // Redirect if data missing
      return;
    }

    const completeOrder = async () => {
      try {
        const { data } = await axios.post(`${API_BASE}api/completedorder`, {
          paymentId,
          orderData,
        });

        if (data.success) {
          // You can redirect to order success page or home
          navigate('/');
        } else {
          alert("Order failed. Please try again.");
          navigate('/');
        }
      } catch (e) {
        const status = e.status || e.response?.status || 500;
        console.log(status)
        navigate('/');
      }
    };

    completeOrder();
  }, [navigate, orderData, paymentId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white text-xl font-semibold">
      Processing your order, please wait...
    </div>
  );
};

export default OrderProcessing;
