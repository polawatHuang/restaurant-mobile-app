"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Camera, QrCode } from "lucide-react";

export default function ScanQRPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = "qr-reader";

  const stopScanning = useCallback(async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  }, []);

  const handleScan = useCallback(async (decodedText: string) => {
    try {
      // Extract table ID from QR code
      const tableData = JSON.parse(decodedText);
      const tableId = tableData.tableId;

      // Stop scanning before navigating
      await stopScanning();

      // Check-in to table
      const response = await fetch("/api/user/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/user/menu?tableId=${data.tableId}&sessionId=${data.sessionId}`);
      } else {
        setError("ไม่สามารถเช็คอินได้ กรุณาลองใหม่อีกครั้ง");
        setScanning(false);
      }
    } catch (err) {
      setError("QR Code ไม่ถูกต้อง");
      setScanning(false);
    }
  }, [router, stopScanning]);

  const startScanning = useCallback(async () => {
    try {
      const html5QrCode = new Html5Qrcode(scannerElementId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors - they're normal while scanning
        }
      );
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      setError("ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึงกล้อง");
      setScanning(false);
    }
  }, [handleScan]);

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      startScanning();
    } else if (!scanning && scannerRef.current) {
      stopScanning();
    }

    return () => {
      if (scannerRef.current) {
        stopScanning();
      }
    };
  }, [scanning, startScanning, stopScanning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-md mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <QrCode className="w-6 h-6" />
              สแกน QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!scanning ? (
              <div className="space-y-4">
                <div className="text-center text-gray-600">
                  <p className="mb-4">สแกน QR Code บนโต๊ะเพื่อเริ่มสั่งอาหาร</p>
                  <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                    <QrCode className="w-24 h-24 mx-auto text-gray-400" />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <Button
                  onClick={() => setScanning(true)}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  เปิดกล้องสแกน QR Code
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
                  <div
                    id={scannerElementId}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 border-4 border-primary-500 rounded-lg pointer-events-none" />
                </div>
                <Button
                  onClick={() => {
                    setScanning(false);
                    setError("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  ยกเลิก
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

