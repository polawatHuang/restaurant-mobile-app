"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Clock, Utensils, CheckCircle, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import CookerNav from "@/components/CookerNav";

interface OrderItem {
  id: string;
  menu: {
    name: string;
  };
  quantity: number;
  price: number;
  status: string;
}

interface Order {
  id: string;
  orderNumber: string;
  table: {
    tableNumber: string;
  };
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export default function CookerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await fetch(`/api/cooker/orders${params}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/cooker/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const updateItemStatus = async (itemId: string, status: string) => {
    try {
      const res = await fetch(`/api/cooker/order-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PREPARING: "bg-purple-100 text-purple-800",
      READY: "bg-green-100 text-green-800",
      SERVED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "รอดำเนินการ",
      CONFIRMED: "ยืนยันแล้ว",
      PREPARING: "กำลังเตรียม",
      READY: "พร้อมเสิร์ฟ",
      SERVED: "เสิร์ฟแล้ว",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CookerNav />
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary-600 mb-4">
            จัดการคำสั่งซื้อ
          </h1>
          <div className="flex gap-2 overflow-x-auto">
            {["ALL", "PENDING", "CONFIRMED", "PREPARING", "READY"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    filter === status
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "ALL" ? "ทั้งหมด" : getStatusText(status)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              ไม่มีคำสั่งซื้อ
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">
                      #{order.orderNumber} - โต๊ะ {order.table.tableNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.menu.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                        {item.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() => updateItemStatus(item.id, "PREPARING")}
                          >
                            เริ่มทำ
                          </Button>
                        )}
                        {item.status === "PREPARING" && (
                          <Button
                            size="sm"
                            onClick={() => updateItemStatus(item.id, "READY")}
                          >
                            พร้อมแล้ว
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <p className="text-lg font-bold">
                    รวม {formatCurrency(order.totalAmount)}
                  </p>
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                      >
                        ยืนยันออเดอร์
                      </Button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "PREPARING")}
                      >
                        เริ่มเตรียม
                      </Button>
                    )}
                    {order.status === "PREPARING" &&
                      order.items.every((item) => item.status === "READY") && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, "READY")}
                        >
                          พร้อมเสิร์ฟ
                        </Button>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

