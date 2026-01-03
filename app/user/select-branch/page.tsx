"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, ArrowRight, Building2 } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

export default function SelectBranchPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) {
        throw new Error("Failed to fetch branches");
      }
      const data = await res.json();
      setBranches(data.filter((b: Branch) => b.isActive));
    } catch (err: any) {
      console.error("Error fetching branches:", err);
      setError("ไม่สามารถโหลดสาขาได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBranch = (branchId: string) => {
    // Store selected branch in localStorage
    localStorage.setItem("selectedBranchId", branchId);
    // Navigate to QR scan page with branch ID
    router.push(`/user/scan?branchId=${branchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดสาขา...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchBranches}>ลองอีกครั้ง</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6" />
              เลือกสาขาร้านอาหาร
            </CardTitle>
          </CardHeader>
          <CardContent>
            {branches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">ไม่พบสาขา</p>
              </div>
            ) : (
              <div className="space-y-3">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleSelectBranch(branch.id)}
                    className="w-full text-left p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {branch.name}
                        </h3>
                        {branch.address && (
                          <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{branch.address}</span>
                          </div>
                        )}
                        {branch.phone && (
                          <p className="text-sm text-gray-600">{branch.phone}</p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary-600 ml-4 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

