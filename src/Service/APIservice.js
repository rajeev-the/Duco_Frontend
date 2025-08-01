import axios from 'axios';

const API_BASE = 'https://duco-backend.onrender.com/'; // Set if you have a different baseURL

export const fetchAllPrices = async () => {
  const response = await axios.get(`${API_BASE}/money/get_money`);
  return response.data;
};

export const createOrUpdatePrice = async (data) => {
  const response = await axios.post(`${API_BASE}/create_location_price_increase`, data);
  return response.data;
};

// src/Service/designAPI.js

export const fetchPreviousDesigns = async (userId) => {
  try {
    const res = await fetch(`https://duco-backend.onrender.com/api/designs/user/${userId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch designs", err);
    return [];
  }
};


export const createDesign = async (payload) => {
  try {
    const res = await axios.post('https://duco-backend.onrender.com/api/designs', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (err) {
    console.error('Design creation failed:', err.response?.data || err.message);
    return null;
  }
};

export const getCategories = async () => {
    try {
      const res = await axios.get("https://duco-backend.onrender.com/category/getall");
      return res.data.category || [];
    } catch (err) {
      console.error("Error fetching categories:", err);
      return null
    }
  };


  export const getSubcategoriesByCategoryId = async (categoryId) => {
  try {
    const res = await axios.get(`https://duco-backend.onrender.com/subcategory/subcat/${categoryId}`);
    return res.data.data || []; // Assuming controller sends { data: [...] }
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return null;
  }
};

  export const getproducts = async () => {
  try {
    const res = await axios.get(`https://duco-backend.onrender.com/products/get/`);
    return res.data || []; // Assuming controller sends { data: [...] }
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return null;
  }
};


export const getproductssingle = async (id) => {
  try {
    const res = await axios.get(`https://duco-backend.onrender.com/products/get/${id}`);
    return res.data || []; // Assuming controller sends { data: [...] }
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return null;
  }
};





export const getproductcategory = async (idsub) => {
  try {
    const res = await axios.get(`https://duco-backend.onrender.com/products/getsub/${idsub}`);
    return res.data || []; // Assuming controller sends { data: [...] }
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    return null;
  }
};
