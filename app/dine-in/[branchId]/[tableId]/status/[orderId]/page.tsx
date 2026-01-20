"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ChefHat } from 'lucide-react';

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the live status here using the ID
  // For now, we show a static success screen

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center text-center">
      
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="text-green-600" size={48} />
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Received!</h1>
      <p className="text-gray-500 mb-8">
        Order #{params.id} has been sent to the kitchen.
      </p>

      {/* Status Steps */}
      <div className="w-full max-w-xs space-y-6 text-left relative pl-4 border-l-2 border-gray-100 ml-4">
        <div className="relative">
          <div className="absolute -left-[21px] top-1 w-4 h-4 bg-green-500 rounded-full ring-4 ring-white"></div>
          <h3 className="font-bold text-gray-900">Order Placed</h3>
          <p className="text-xs text-gray-400">Just now</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[21px] top-1 w-4 h-4 bg-orange-400 rounded-full ring-4 ring-white animate-pulse"></div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            Preparing <ChefHat size={14} />
          </h3>
          <p className="text-xs text-gray-400">Kitchen is working on it</p>
        </div>
        <div className="relative opacity-50">
          <div className="absolute -left-[21px] top-1 w-4 h-4 bg-gray-300 rounded-full ring-4 ring-white"></div>
          <h3 className="font-bold text-gray-900">Served</h3>
          <p className="text-xs text-gray-400">Coming soon</p>
        </div>
      </div>

      <div className="mt-12 w-full">
        <Link href="/dine-in/menu">
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
            Order More Items
          </button>
        </Link>
      </div>
    </div>
  );
}