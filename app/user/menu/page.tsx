"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ShoppingCart, Plus, Minus, Bell, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Menu {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  image?: string;
  category: {
    id: string;
    name: string;
  };
}

interface CartItem {
  menu: Menu;
  quantity: number;
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get("tableId");
  const sessionId = searchParams.get("sessionId");

  const [categories, setCategories] = useState<any[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tableId) {
      fetchCategories();
      fetchMenus();
    }
  }, [tableId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/menus");
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menu: Menu) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menu, quantity: 1 }];
    });
  };

  const updateQuantity = (menuId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((item) => item.menu.id === menuId);
      if (item) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter((item) => item.menu.id !== menuId);
        }
        return prev.map((item) =>
          item.menu.id === menuId ? { ...item, quantity: newQuantity } : item
        );
      }
      return prev;
    });
  };

  const filteredMenus = selectedCategory
    ? menus.filter((menu) => menu.category.id === selectedCategory)
    : menus;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.menu.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/user/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId,
          sessionId,
          items: cart.map((item) => ({
            menuId: item.menu.id,
            quantity: item.quantity,
            price: item.menu.price,
          })),
        }),
      });

      if (response.ok) {
        setCart([]);
        router.push(`/user/orders?tableId=${tableId}&sessionId=${sessionId}`);
      }
    } catch (err) {
      console.error("Error creating order:", err);
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">เมนูอาหาร</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/user/call-waiter?tableId=${tableId}`)}
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/user/orders?tableId=${tableId}&sessionId=${sessionId}`)}
            >
              <Receipt className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredMenus.map((menu) => {
            const cartItem = cart.find((item) => item.menu.id === menu.id);
            return (
              <Card key={menu.id} className="overflow-hidden">
                <div className="aspect-square relative bg-gray-100">
                  {menu.image ? (
                    <Image
                      src={menu.image}
                      alt={menu.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{menu.name}</h3>
                  {menu.nameEn && (
                    <p className="text-xs text-gray-500 mb-2">{menu.nameEn}</p>
                  )}
                  <p className="text-primary-600 font-bold mb-3">
                    {formatCurrency(menu.price)}
                  </p>
                  {cartItem ? (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => updateQuantity(menu.id, -1)}
                        className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(menu.id, 1)}
                        className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(menu)}
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      เพิ่ม
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} รายการ
                </p>
                <p className="text-xl font-bold text-primary-600">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <Button onClick={handleCheckout} size="lg" className="px-8">
                <ShoppingCart className="w-5 h-5 mr-2" />
                สั่งอาหาร
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

