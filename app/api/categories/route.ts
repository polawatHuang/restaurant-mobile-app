import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const categories = await apiClient.get("/categories");

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

