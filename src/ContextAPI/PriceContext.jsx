import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
const PriceContext = createContext();

// Provider Component
export const PriceProvider = ({ children }) => {

  const [toConvert, setToConvert] = useState(1);
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [location, setLocation] = useState("India");

  const API_BASE = 'https://duco-backend-mhru.onrender.com/';

  useEffect(() => {

    if (!location) return;

    const fetchPriceData = async () => {

      try {

        const response = await axios.post(
          `${API_BASE}money/get_location_increase`,
          {
            location:"India"
          }
        );

        const data = response.data;

        console.log(data);

        setPriceIncrease(data?.percentage || 0);

        setToConvert(data?.currency?.toconvert || 1);

      } catch (error) {

        console.error('Error fetching price data:', error);

      }

    };

    fetchPriceData();

  }, [location]);

  return (
    <PriceContext.Provider
      value={{
        toConvert,
        priceIncrease,
        location,
        setLocation
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

// Custom Hook
export const usePriceContext = () => {
  return useContext(PriceContext);
};