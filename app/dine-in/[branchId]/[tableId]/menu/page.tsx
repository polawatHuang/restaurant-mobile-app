"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../../CartContext';
import { ShoppingBag, Plus } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

export default function MenuPage() {
  const { addToCart, totalItems, tableNumber } = useCart();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`)
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(menu.map(i => i.category)))];
  const filteredItems = activeCategory === "All" ? menu : menu.filter(i => i.category === activeCategory);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading menu...</div>;

  return (
    <div className="pb-24">
      {/* Table Info Bar */}
      <div className="bg-orange-50 px-4 py-2 text-xs font-bold text-orange-800 flex justify-between">
        <span>Ordering for: Table {tableNumber}</span>
        <Link href="/dine-in" className="underline">Change</Link>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 bg-white shadow-sm z-10 overflow-x-auto whitespace-nowrap p-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`mr-3 px-5 py-2 rounded-full text-sm font-bold transition ${
              activeCategory === cat 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="p-4 space-y-6">
        {filteredItems.map(item => (
          <div key={item.id} className="flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
               {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            
            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-lg">${Number(item.price).toFixed(2)}</span>
                
                {item.is_available ? (
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-orange-100 text-orange-700 p-2 rounded-full hover:bg-orange-200 transition"
                  >
                    <Plus size={18} />
                  </button>
                ) : (
                  <span className="text-xs text-red-500 font-bold border border-red-200 px-2 py-1 rounded">Sold Out</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 max-w-md mx-auto">
          <Link href="/dine-in/cart">
            <button className="w-full bg-black text-white py-4 rounded-xl shadow-xl flex justify-between items-center px-6">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </div>
                <span className="font-bold">View Cart</span>
              </div>
              <ShoppingBag size={20} />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}