"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderOpen, UtensilsCrossed, BarChart3, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "./LogoutButton";

const navItems = [
  { href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: Users },
  { href: "/admin/categories", label: "หมวดหมู่", icon: FolderOpen },
  { href: "/admin/menus", label: "เมนู", icon: UtensilsCrossed },
  { href: "/admin/reports", label: "รายงาน", icon: BarChart3 },
  { href: "/admin/career-path", label: "เส้นทางการทำงาน", icon: Award },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-200"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          </div>
          <div className="ml-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

