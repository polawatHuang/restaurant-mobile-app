"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Utensils, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AdminNav from "@/components/AdminNav";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">แดชบอร์ด</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ยอดขายวันนี้</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(stats.todayRevenue)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-primary-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ออเดอร์ทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalOrders}
                  </p>
                </div>
                <Utensils className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ออเดอร์รอดำเนินการ</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pendingOrders}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ผู้ใช้ทั้งหมด</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.activeUsers}
                  </p>
                </div>
                <Users className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

