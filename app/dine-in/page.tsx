"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { MapPin, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const { setTableNumber } = useCart();
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setTableNumber(input);
    router.push('/dine-in/menu');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-orange-200 blur-xl opacity-50 rounded-full"></div>
        <img 
          src="/logo-placeholder.png" 
          alt="Restaurant Logo" 
          className="w-32 h-32 relative object-contain" 
          onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150?text=Logo"}
        />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome!</h1>
      <p className="text-gray-500 mb-8">Scan QR or enter your table number to start ordering.</p>

      <form onSubmit={handleStart} className="w-full max-w-xs space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Table Number (e.g., T-12)"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center font-bold text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
        >
          View Menu <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
}