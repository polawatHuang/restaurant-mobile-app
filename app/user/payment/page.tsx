"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CreditCard, CheckCircle, Share2, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  id: string;
  menu: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  items: OrderItem[];
  table: {
    tableNumber: string;
  };
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/user/orders/${orderId}`);
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (method: string) => {
    if (!order) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/user/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalAmount,
          method,
        }),
      });

      if (res.ok) {
        await fetchOrder();
        alert("ชำระเงินสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการชำระเงิน");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    } finally {
      setProcessing(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "บิลค่าอาหาร",
        text: `บิลโต๊ะ ${order?.table.tableNumber} - ${formatCurrency(order?.totalAmount || 0)}`,
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">ไม่พบรายการสั่งอาหาร</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "PAID";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary-600">บิลค่าอาหาร</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="ml-auto"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>โต๊ะ {order.table.tableNumber}</CardTitle>
            <p className="text-sm text-gray-500">#{order.orderNumber}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
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

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">ยอดรวม</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>

              {isPaid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">ชำระเงินแล้ว</p>
                    <p className="text-sm text-green-600">ขอบคุณสำหรับการชำระเงิน</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-medium mb-2">วิธีการชำระเงิน</p>
                  <Button
                    onClick={() => handlePayment("CASH")}
                    className="w-full"
                    size="lg"
                    disabled={processing}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    ชำระเงินสด
                  </Button>
                  <Button
                    onClick={() => handlePayment("QR_CODE")}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={processing}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    ชำระด้วย QR Code
                  </Button>
                  {processing && (
                    <p className="text-center text-sm text-gray-500">
                      กำลังประมวลผล...
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

