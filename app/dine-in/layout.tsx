"use client";

import { CartProvider } from './CartContext';
import { Utensils } from 'lucide-react';

export default function DineInLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-100 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white p-4 shadow-sm z-10 sticky top-0 flex items-center justify-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-full text-white">
            <Utensils size={18} />
          </div>
          <span className="font-bold text-gray-800 tracking-tight">Gourmet Burger Joint</span>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}