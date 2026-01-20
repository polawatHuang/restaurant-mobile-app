"use client";

import React from 'react';
import Link from 'next/link';
import { ChefHat, LogOut } from 'lucide-react';

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Simple Top Bar */}
      <header className="bg-white text-gray-800 shadow-sm h-16 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <ChefHat className="text-orange-600" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Kitchen Display System</span>
        </div>
        
        <div className="flex items-center gap-4">
           <span className="text-sm text-gray-500 font-medium">Branch #1 (Main)</span>
           <Link 
             href="/login" 
             className="text-red-600 hover:bg-red-50 p-2 rounded-md transition"
             title="Logout"
           >
             <LogOut size={20} />
           </Link>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        {children}
      </main>
    </div>
  );
}