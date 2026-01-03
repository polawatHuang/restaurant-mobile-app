"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Edit, AlertCircle } from "lucide-react";
import CookerNav from "@/components/CookerNav";

interface Ingredient {
  id: string;
  name: string;
  nameEn?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    unit: "",
    quantity: 0,
    minQuantity: 0,
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await fetch("/api/cooker/ingredients");
      const data = await res.json();
      setIngredients(data);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing
        ? `/api/cooker/ingredients/${editing.id}`
        : "/api/cooker/ingredients";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchIngredients();
        resetForm();
      }
    } catch (err) {
      console.error("Error saving ingredient:", err);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setFormData({
      name: ingredient.name,
      nameEn: ingredient.nameEn || "",
      unit: ingredient.unit,
      quantity: ingredient.quantity,
      minQuantity: ingredient.minQuantity,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      unit: "",
      quantity: 0,
      minQuantity: 0,
    });
    setEditing(null);
    setShowForm(false);
  };

  const isLowStock = (ingredient: Ingredient) =>
    ingredient.quantity <= ingredient.minQuantity;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CookerNav />
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">จัดการวัตถุดิบ</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            เพิ่มวัตถุดิบ
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editing ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อวัตถุดิบ (ไทย)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อวัตถุดิบ (อังกฤษ)
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หน่วย
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="กก., ลิตร, ชิ้น"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      จำนวน
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      จำนวนขั้นต่ำ
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minQuantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editing ? "บันทึก" : "เพิ่ม"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ยกเลิก
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ingredient) => (
            <Card
              key={ingredient.id}
              className={
                isLowStock(ingredient) ? "border-red-500 border-2" : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                    {ingredient.nameEn && (
                      <p className="text-sm text-gray-500">
                        {ingredient.nameEn}
                      </p>
                    )}
                  </div>
                  {isLowStock(ingredient) && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm">
                    <span className="text-gray-600">จำนวนคงเหลือ: </span>
                    <span
                      className={
                        isLowStock(ingredient)
                          ? "font-bold text-red-600"
                          : "font-semibold"
                      }
                    >
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    จำนวนขั้นต่ำ: {ingredient.minQuantity} {ingredient.unit}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleEdit(ingredient)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  แก้ไข
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

