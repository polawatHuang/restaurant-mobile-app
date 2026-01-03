"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, Clock, CheckCircle, Utensils, Share2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  id: string;
  menu: {
    name: string;
    image?: string;
  };
  quantity: number;
  price: number;
  status: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get("tableId");
  const sessionId = searchParams.get("sessionId");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchOrders();
    }
  }, [sessionId]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/user/orders?sessionId=${sessionId}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
      case "CONFIRMED":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "PREPARING":
        return <Utensils className="w-5 h-5 text-blue-500" />;
      case "READY":
      case "SERVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "รอดำเนินการ",
      CONFIRMED: "ยืนยันแล้ว",
      PREPARING: "กำลังเตรียม",
      READY: "พร้อมเสิร์ฟ",
      SERVED: "เสิร์ฟแล้ว",
      CANCELLED: "ยกเลิก",
    };
    return statusMap[status] || status;
  };

  const handleShare = (orderId: string) => {
    const url = `${window.location.origin}/user/payment?orderId=${orderId}`;
    if (navigator.share) {
      navigator.share({
        title: "บิลค่าอาหาร",
        text: "แชร์บิลค่าอาหาร",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/user/menu?tableId=${tableId}&sessionId=${sessionId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary-600">รายการสั่งอาหาร</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              ไม่มีรายการสั่งอาหาร
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.menu.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <p className="text-lg font-bold">
                    รวม {formatCurrency(order.totalAmount)}
                  </p>
                  <div className="flex gap-2">
                    {order.paymentStatus === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/user/payment?orderId=${order.id}`)
                        }
                      >
                        จ่ายเงิน
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(order.id)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
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

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}

