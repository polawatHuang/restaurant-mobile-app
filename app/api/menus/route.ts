import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const menus = await apiClient.get("/menus");

    return NextResponse.json(menus);
  } catch (error: any) {
    console.error("Get menus error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

