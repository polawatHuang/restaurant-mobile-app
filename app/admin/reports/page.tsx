"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import AdminNav from "@/components/AdminNav";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportData {
  date: string;
  revenue: number;
  orders: number;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<"day" | "month" | "year">("day");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrder: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?period=${period}`);
      const data = await res.json();
      setReportData(data.data || []);
      setSummary(data.summary || summary);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary-600">รายงานการขาย</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setPeriod("day")}
              variant={period === "day" ? "primary" : "outline"}
            >
              รายวัน
            </Button>
            <Button
              onClick={() => setPeriod("month")}
              variant={period === "month" ? "primary" : "outline"}
            >
              รายเดือน
            </Button>
            <Button
              onClick={() => setPeriod("year")}
              variant={period === "year" ? "primary" : "outline"}
            >
              รายปี
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">ยอดขายรวม</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">จำนวนออเดอร์</p>
              <p className="text-2xl font-bold text-blue-600">
                {summary.totalOrders}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">ค่าเฉลี่ยต่อออเดอร์</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.averageOrder)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </CardContent>
          </Card>
        ) : reportData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">ไม่มีข้อมูล</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>กราฟยอดขาย</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      name="ยอดขาย"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>กราฟจำนวนออเดอร์</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#3b82f6" name="จำนวนออเดอร์" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

