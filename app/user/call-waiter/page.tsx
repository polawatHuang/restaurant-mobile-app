"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Utensils, ChefHat, Droplets, MoreHorizontal, ArrowLeft } from "lucide-react";

const waiterOptions = [
  {
    type: "UTENSILS",
    icon: Utensils,
    label: "ขออุปกรณ์",
    description: "ช้อน ส้อม มีด",
  },
  {
    type: "CONDIMENTS",
    icon: ChefHat,
    label: "ขอเครื่องปรุง",
    description: "น้ำปลา พริก น้ำตาล",
  },
  {
    type: "REFILL_DRINKS",
    icon: Droplets,
    label: "เติมเครื่องดื่ม",
    description: "เติมน้ำ เครื่องดื่ม",
  },
  {
    type: "OTHER",
    icon: MoreHorizontal,
    label: "อื่นๆ",
    description: "ต้องการความช่วยเหลืออื่นๆ",
  },
];

function CallWaiterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get("tableId");

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !tableId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/user/call-waiter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId,
          type: selectedType,
          message: message || undefined,
        }),
      });

      if (res.ok) {
        alert("แจ้งพนักงานเรียบร้อยแล้ว");
        router.back();
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("Error calling waiter:", err);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary-600">เรียกพนักงาน</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              ต้องการให้พนักงานช่วยเหลือทางด้านใด?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {waiterOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedType === option.type;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-primary-300"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-primary-100" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            isSelected ? "text-primary-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${
                            isSelected ? "text-primary-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedType && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    หมายเหตุเพิ่มเติม (ไม่บังคับ)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? "กำลังส่ง..." : "ส่งคำขอ"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CallWaiterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    }>
      <CallWaiterPageContent />
    </Suspense>
  );
}

