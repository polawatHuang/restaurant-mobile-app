"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  MapPin, 
  FileBarChart, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react'; 
// Note: If you don't have lucide-react, run: npm install lucide-react

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu Items', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Branches & Tables', href: '/admin/branches', icon: MapPin },
    { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* -------------------- SIDEBAR (Desktop) -------------------- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600 tracking-tight">AdminPanel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* -------------------- MOBILE HEADER -------------------- */}
      <div className="md:hidden fixed w-full bg-white border-b border-gray-200 z-20 h-16 flex items-center justify-between px-4">
        <span className="font-bold text-blue-600">AdminPanel</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* -------------------- MOBILE MENU OVERLAY -------------------- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-10" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full pt-20 p-4 space-y-2" onClick={e => e.stopPropagation()}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                  pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- MAIN CONTENT -------------------- */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}