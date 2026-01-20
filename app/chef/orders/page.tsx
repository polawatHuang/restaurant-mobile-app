"use client";

import React, { useState, useEffect } from 'react';
import { Search, Calendar, RefreshCcw, Eye, ArrowUpCircle } from 'lucide-react';

// 1. Data Types
interface OrderHistoryItem {
  id: number;
  tableNumber: string; // or extracted from user data
  status: 'PENDING' | 'COOKING' | 'READY' | 'SERVED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  items: string; // JSON string
  notes?: string;
}

// 2. Fetcher
async function fetchOrderHistory(date?: string, search?: string) {
  // Build query params
  const params = new URLSearchParams();
  if (date) params.append('date', date); // Assuming backend supports date filtering
  if (search) params.append('search', search); // Assuming backend supports search
  
  // By default, we might want all statuses or just 'SERVED'/'CANCELLED'
  // params.append('status', 'SERVED'); 
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?${params.toString()}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export default function ChefOrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]); // Today
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadHistory();
  }, [dateFilter]); // Reload when date changes

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchOrderHistory(dateFilter, searchQuery);
      // Client-side sort: Newest first
      const sorted = data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search Handler (Simple client-side filtering if API doesn't support deep search)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadHistory();
  };

  // 3. "Recall" Action (Move back to Active Board)
  const recallOrder = async (id: number) => {
    if(!confirm("Recall this order back to the Kitchen Board?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'COOKING' })
      });
      alert("Order recalled to Cooking");
      loadHistory(); // Refresh list
    } catch (err) {
      alert("Failed to recall order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <RefreshCcw className="text-blue-600" />
            Order History
          </h1>
          <p className="text-gray-500">Review served tickets and daily logs</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Date Picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or Table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
          </form>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Table</th>
              <th className="px-6 py-4">Items Summary</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading history...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No orders found for this date.</td>
              </tr>
            ) : (
              orders.map((order) => {
                // Parse items for summary
                const items = JSON.parse(order.items || "[]");
                const summary = items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ");
                const timeString = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={order.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono">{timeString}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">#{order.id}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                        {order.tableNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600" title={summary}>
                      {summary || "No items (Error)"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'SERVED' || order.status === 'CANCELLED' ? (
                        <button 
                          onClick={() => recallOrder(order.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1 ml-auto text-xs font-medium"
                        >
                          <ArrowUpCircle size={16} />
                          Recall
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper Component for Status Colors
function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-blue-100 text-blue-700",
    COOKING: "bg-orange-100 text-orange-700",
    READY: "bg-green-100 text-green-700",
    SERVED: "bg-gray-100 text-gray-600 line-through",
    CANCELLED: "bg-red-100 text-red-700",
  };
  
  // @ts-ignore
  const currentStyle = styles[status] || "bg-gray-100 text-gray-500";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${currentStyle}`}>
      {status}
    </span>
  );
}