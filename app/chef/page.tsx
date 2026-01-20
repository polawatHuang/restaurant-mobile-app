"use client";

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Flame, Bell } from 'lucide-react';

// 1. Data Types
interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

interface Order {
  id: number;
  tableNumber: string; // e.g., "T-12"
  status: 'PENDING' | 'COOKING' | 'READY' | 'SERVED';
  createdAt: string;
  items: string; // JSON string from DB, we will parse this
}

// 2. Mock Fetcher (In real app, call your API)
// We use client-side fetching here for auto-refresh capabilities
async function fetchActiveOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?status=active`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

export default function ChefKitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 3. Load Data & Auto-Refresh
  const loadOrders = async () => {
    try {
      // fetching data (mock implementation for logic demonstration)
      // replace this with actual fetchActiveOrders() call
      const data = await fetchActiveOrders().catch(() => []); 
      setOrders(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Polling error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // 4. Update Status Action
  const updateStatus = async (orderId: number, newStatus: string) => {
    // Optimistic Update (update UI immediately for speed)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'PUT', // Using your Update endpoint
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
    } catch (err) {
      alert("Failed to save status. Check connection.");
      loadOrders(); // Revert on error
    }
  };

  // Helper to parse items safely
  const parseItems = (jsonItems: string) => {
    try {
      // Assuming your DB stores simple JSON or array. 
      // Adjust based on your actual 'category' or 'quantity' fields
      // For this view, we just need a list to display.
      return JSON.parse(jsonItems || "[]");
    } catch (e) {
      return []; 
    }
  };

  // Calculate time elapsed
  const getElapsedMinutes = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    return Math.floor(diff / 60000);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading kitchen tickets...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
        <button 
          onClick={loadOrders} 
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm text-gray-700 transition"
        >
          Refresh Now
        </button>
      </div>

      {/* KANBAN COLUMNS */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
        
        {/* --- COLUMN 1: NEW ORDERS --- */}
        <div className="bg-gray-200 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold uppercase tracking-wide">
            <Bell size={18} />
            <h2>New Orders ({orders.filter(o => o.status === 'PENDING').length})</h2>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {orders.filter(o => o.status === 'PENDING').map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                color="border-l-4 border-blue-500"
                actionLabel="Start Cooking"
                onAction={() => updateStatus(order.id, 'COOKING')}
                elapsed={getElapsedMinutes(order.createdAt)}
              />
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: COOKING --- */}
        <div className="bg-orange-50 rounded-xl p-4 flex flex-col border border-orange-100">
          <div className="flex items-center gap-2 mb-4 text-orange-700 font-bold uppercase tracking-wide">
            <Flame size={18} />
            <h2>Cooking ({orders.filter(o => o.status === 'COOKING').length})</h2>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {orders.filter(o => o.status === 'COOKING').map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                color="border-l-4 border-orange-500"
                actionLabel="Mark Ready"
                onAction={() => updateStatus(order.id, 'READY')}
                elapsed={getElapsedMinutes(order.createdAt)}
              />
            ))}
          </div>
        </div>

        {/* --- COLUMN 3: READY TO SERVE --- */}
        <div className="bg-green-50 rounded-xl p-4 flex flex-col border border-green-100">
          <div className="flex items-center gap-2 mb-4 text-green-700 font-bold uppercase tracking-wide">
            <CheckCircle size={18} />
            <h2>Ready ({orders.filter(o => o.status === 'READY').length})</h2>
          </div>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {orders.filter(o => o.status === 'READY').map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                color="border-l-4 border-green-500"
                actionLabel="Complete"
                onAction={() => updateStatus(order.id, 'SERVED')}
                elapsed={getElapsedMinutes(order.createdAt)}
                isReady
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: ORDER CARD ---
function OrderCard({ order, color, actionLabel, onAction, elapsed, isReady }: any) {
  // Parse ticket codes or items from your specific data structure
  // For this demo, we assume 'category' + 'quantity' or a JSON field
  const displayItems = order.items ? JSON.parse(order.items || "[]") : [];
  // Fallback if items are not in JSON (using your controller's structure)
  const mainItem = `${order.quantity}x ${order.category || 'Item'}`; 

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition ${color}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="font-bold text-lg text-gray-800">#{order.id}</span>
          <span className="ml-2 text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Table {order.tableNumber || 'N/A'}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${elapsed > 20 ? 'text-red-500' : 'text-gray-400'}`}>
          <Clock size={12} />
          <span>{elapsed}m</span>
        </div>
      </div>

      <div className="mb-4 border-t border-b border-gray-50 py-2 space-y-1">
        {/* If you have a complex item list, map it here. Otherwise, show summary */}
        {displayItems.length > 0 ? (
          displayItems.map((item: any, idx: number) => (
            <div key={idx} className="text-sm text-gray-700 font-medium">
              {item.quantity}x {item.name}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-800 font-medium">{mainItem}</div>
        )}
        
        {/* Notes (e.g. "No Spicy") */}
        {order.notes && (
          <div className="text-xs text-red-500 italic mt-1">
            Note: {order.notes}
          </div>
        )}
      </div>

      <button 
        onClick={onAction}
        className={`w-full py-2 rounded-md text-sm font-bold transition text-white ${
          isReady 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}