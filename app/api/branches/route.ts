import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

export async function GET() {
  try {
    const branches = await apiClient.get("/branches");

    return NextResponse.json(branches);
  } catch (error: any) {
    console.error("Get branches error:", error);
    // Return empty array if backend doesn't have branches endpoint yet
    return NextResponse.json([]);
  }
}

