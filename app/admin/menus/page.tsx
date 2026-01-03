"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AdminNav from "@/components/AdminNav";

interface Category {
  id: string;
  name: string;
}

interface Menu {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  image?: string;
  category: Category;
  isActive: boolean;
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    price: 0,
    categoryId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/admin/menus");
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
      if (data.length > 0 && !formData.categoryId) {
        setFormData({ ...formData, categoryId: data[0].id });
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing
        ? `/api/admin/menus/${editing.id}`
        : "/api/admin/menus";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchMenus();
        resetForm();
      }
    } catch (err) {
      console.error("Error saving menu:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบเมนูนี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/menus/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMenus();
      }
    } catch (err) {
      console.error("Error deleting menu:", err);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditing(menu);
    setFormData({
      name: menu.name,
      nameEn: menu.nameEn || "",
      description: menu.description || "",
      price: menu.price,
      categoryId: menu.category.id,
      isActive: menu.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      price: 0,
      categoryId: categories[0]?.id || "",
      isActive: true,
    });
    setEditing(null);
    setShowForm(false);
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
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary-600">จัดการเมนู</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            เพิ่มเมนู
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editing ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อเมนู (ไทย)
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
                      ชื่อเมนู (อังกฤษ)
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมวดหมู่
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ราคา (บาท)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mr-2"
                    />
                    เปิดใช้งาน
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editing ? "บันทึก" : "เพิ่ม"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ยกเลิก
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <Card key={menu.id}>
              <CardContent className="p-4">
                <div className="aspect-square relative bg-gray-100 rounded-lg mb-3">
                  {menu.image ? (
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{menu.name}</h3>
                {menu.nameEn && (
                  <p className="text-sm text-gray-500 mb-2">{menu.nameEn}</p>
                )}
                <p className="text-primary-600 font-bold mb-2">
                  {formatCurrency(menu.price)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {menu.category.name}
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs mb-3 ${
                    menu.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {menu.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(menu)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    แก้ไข
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(menu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

