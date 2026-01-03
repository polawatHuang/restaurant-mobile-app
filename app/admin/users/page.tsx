"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminNav from "@/components/AdminNav";

interface User {
  id: string;
  name: string;
  email: string | null;
  role: string;
  careerPath?: {
    position: string;
    salary: number;
    improvementPoints: number;
    level: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COOKER",
    position: "",
    salary: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing
        ? `/api/admin/users/${editing.id}`
        : "/api/admin/users";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsers();
        resetForm();
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setFormData({
      name: user.name,
      email: user.email || "",
      password: "",
      role: user.role,
      position: user.careerPath?.position || "",
      salary: user.careerPath?.salary || 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "COOKER",
      position: "",
      salary: 0,
    });
    setEditing(null);
    setShowForm(false);
  };

  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      USER: "ลูกค้า",
      COOKER: "พนักงานครัว",
      ADMIN: "ผู้ดูแลระบบ",
    };
    return roleMap[role] || role;
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
          <h1 className="text-3xl font-bold text-primary-600">จัดการผู้ใช้</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            เพิ่มผู้ใช้
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editing ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ
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
                      อีเมล
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      บทบาท
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="COOKER">พนักงานครัว</option>
                      <option value="ADMIN">ผู้ดูแลระบบ</option>
                    </select>
                  </div>
                </div>
                {formData.role === "COOKER" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เงินเดือน
                      </label>
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salary: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
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

        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                        {getRoleText(user.role)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    {user.careerPath && (
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="text-gray-600">ตำแหน่ง: </span>
                          <span className="font-medium">
                            {user.careerPath.position}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">เงินเดือน: </span>
                          <span className="font-medium">
                            {formatCurrency(user.careerPath.salary)}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">คะแนนความดี: </span>
                          <span className="font-medium">
                            {user.careerPath.improvementPoints}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">ระดับ: </span>
                          <span className="font-medium">
                            {user.careerPath.level}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {user.role !== "ADMIN" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

