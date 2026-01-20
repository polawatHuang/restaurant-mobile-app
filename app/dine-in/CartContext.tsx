"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  tableNumber: string;
  setTableNumber: (num: string) => void;
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");

  // Load from local storage on mount
  useEffect(() => {
    const savedTable = localStorage.getItem('dinein_table');
    if (savedTable) setTableNumber(savedTable);
    
    const savedCart = localStorage.getItem('dinein_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('dinein_table', tableNumber);
    localStorage.setItem('dinein_cart', JSON.stringify(cart));
  }, [cart, tableNumber]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ tableNumber, setTableNumber, cart, addToCart, removeFromCart, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};