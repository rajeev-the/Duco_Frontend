// src/Service/authService.js
import axios from 'axios';

const BASE_URL = 'https://duco-backend.onrender.com/user'; // update with your actual backend base URL

// Signup Service
export const signupUser = async ({ name, number }) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, {
      name,
      number,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// Login Service
export const loginUser = async ({ number }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      number,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const addAddressToUser = async ({ userId, address }) => {
  console.log("Adding address for user:", userId, "Address:", address);
  try {
    const response = await axios.post(`${BASE_URL}/add-address`, {
     userId: userId,
     newAddress: address
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add address" };
  }
};
