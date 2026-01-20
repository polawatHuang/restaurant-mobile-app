"use client";

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// 1. Data Types
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  is_available: boolean; // mapped from DB tinyint/boolean
  stock_count?: number; // Optional: if you track specific counts
}

// 2. Fetcher
async function fetchInventory() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to load inventory');
  return res.json();
}

export default function ChefInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'SOLD_OUT'>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchInventory();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Toggle Availability Handler
  const toggleAvailability = async (id: number, currentStatus: boolean) => {
    // Optimistic UI update
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, is_available: !currentStatus } : item
    ));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !currentStatus })
      });
      // Optional: Call revalidate API here to update public menu immediately
    } catch (err) {
      alert("Failed to update status");
      loadData(); // Revert
    }
  };

  // 4. Filtering Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filter === 'ALL' ? true :
      filter === 'AVAILABLE' ? item.is_available :
      !item.is_available;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quick Inventory</h1>
          <p className="text-gray-500">Manage item availability ("86" List)</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search ingredients or dishes..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'AVAILABLE', 'SOLD_OUT'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition ${
              filter === f 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`
              relative p-5 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center
              ${item.is_available 
                ? 'bg-white border-gray-200 hover:border-blue-300' 
                : 'bg-red-50 border-red-200 opacity-90'
              }
            `}
            // Allow clicking whole card to toggle
            onClick={() => toggleAvailability(item.id, item.is_available)}
          >
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className={`text-lg font-bold mt-1 ${item.is_available ? 'text-gray-800' : 'text-red-700 line-through'}`}>
                {item.name}
              </h3>
              <p className={`text-sm mt-1 font-medium ${item.is_available ? 'text-green-600' : 'text-red-600'}`}>
                {item.is_available ? 'In Stock' : 'SOLD OUT'}
              </p>
            </div>

            {/* Toggle Switch Visual */}
            <div className={`
              w-14 h-8 rounded-full flex items-center p-1 transition-colors duration-300
              ${item.is_available ? 'bg-green-500' : 'bg-gray-300'}
            `}>
              <div className={`
                bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300
                ${item.is_available ? 'translate-x-6' : 'translate-x-0'}
              `}></div>
            </div>

            {/* Status Icon Overlay for clarity */}
            {!item.is_available && (
              <div className="absolute top-2 right-2 text-red-500">
                <AlertCircle size={16} />
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            No items found matching your search.
          </div>
        )}
      </div>

    </div>
  );
}