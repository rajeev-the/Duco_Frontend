import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

const addToCart = (product) => {
  const {
    id,
    design,
    size = 'M',
    color = '#ffffff',
    quantity = 1,
    price = 0,
    colortext = 'white',
    gender ="Female"
  } = product;

  const exists = cart.find(
    (item) =>
      item.id === id &&
      item.size === size &&
      item.color === color &&
      item.design === design &&
      item.colortext === colortext &&
      item.gender === gender
  );

  if (exists) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color &&
        item.design === design &&
        item.colortext === colortext &&
        item.gender === gender
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    );
  } else {
    const data = { id, design, size, color, quantity, price, colortext,gender };
    setCart((prevCart) => [...prevCart, data]);
  }
};


const removeFromCart = (id, size = null, color = null, design = null) => {
  setCart((prevCart) =>
    prevCart.filter((item) => {
      // If size/color/design are provided, match all fields
      if (size && color && design) {
        return !(
          item.id === id &&
          item.size === size &&
          item.color === color &&
          item.design === design
        );
      }

      // If only id is provided, remove all matching this id
      return item.id !== id;
    })
  );
};


  // Clear all items
  const clearCart = () => {
    setCart([]);
  };

  // Update quantity (optional utility)
  const updateQuantity = (id, size, color, design, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color &&
        item.design === design
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // at bottom of CartProvider.js
return (
  <CartContext.Provider
    value={{ cart, addtocart: addToCart, removeFromCart, clearCart, updateQuantity }}
  >
    {children}
  </CartContext.Provider>
);

};
