"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { TrendingUp, Award, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AdminNav from "@/components/AdminNav";

interface CareerPath {
  id: string;
  user: {
    id: string;
    name: string;
    email: string | null;
  };
  position: string;
  salary: number;
  improvementPoints: number;
  level: number;
}

export default function CareerPathPage() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CareerPath | null>(null);
  const [formData, setFormData] = useState({
    improvementPoints: 0,
    salary: 0,
    level: 1,
  });

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      const res = await fetch("/api/admin/career-paths");
      const data = await res.json();
      setCareerPaths(data);
    } catch (err) {
      console.error("Error fetching career paths:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (career: CareerPath) => {
    setEditing(career);
    setFormData({
      improvementPoints: career.improvementPoints,
      salary: career.salary,
      level: career.level,
    });
  };

  const handleSubmit = async () => {
    if (!editing) return;

    try {
      const res = await fetch(`/api/admin/career-paths/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: editing.user.id,
        }),
      });

      if (res.ok) {
        fetchCareerPaths();
        setEditing(null);
      }
    } catch (err) {
      console.error("Error updating career path:", err);
    }
  };

  const addPoints = async (id: string, points: number) => {
    try {
      const career = careerPaths.find((c) => c.id === id);
      if (!career) return;

      const res = await fetch(`/api/admin/career-paths/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: career.user.id,
          improvementPoints: career.improvementPoints + points,
          salary: career.salary,
          level: career.level,
        }),
      });

      if (res.ok) {
        fetchCareerPaths();
      }
    } catch (err) {
      console.error("Error adding points:", err);
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
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-primary-600 mb-6">
          ระบบเส้นทางการทำงาน
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careerPaths.map((career) => (
            <Card key={career.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{career.user.name}</h3>
                    <p className="text-sm text-gray-600">{career.user.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Award className="w-5 h-5" />
                    <span className="font-bold">Lv.{career.level}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">เงินเดือน</span>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(career.salary)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600">คะแนนความดี</span>
                    </div>
                    <span className="font-bold">{career.improvementPoints}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ตำแหน่ง</p>
                    <p className="font-semibold">{career.position}</p>
                  </div>
                </div>

                {editing?.id === career.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        คะแนนความดี
                      </label>
                      <input
                        type="number"
                        value={formData.improvementPoints}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            improvementPoints: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ระดับ
                      </label>
                      <input
                        type="number"
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            level: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmit} size="sm" className="flex-1">
                        บันทึก
                      </Button>
                      <Button
                        onClick={() => setEditing(null)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleEdit(career)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      แก้ไข
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => addPoints(career.id, 10)}
                        size="sm"
                        variant="secondary"
                      >
                        +10 คะแนน
                      </Button>
                      <Button
                        onClick={() => addPoints(career.id, 50)}
                        size="sm"
                        variant="secondary"
                      >
                        +50 คะแนน
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

