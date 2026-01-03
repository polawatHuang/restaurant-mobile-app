import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiClient } from "@/lib/api-client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "COOKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ingredients = await apiClient.get("/cooker/ingredients");

    return NextResponse.json(ingredients);
  } catch (error: any) {
    console.error("Get ingredients error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "COOKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const ingredient = await apiClient.post("/cooker/ingredients", body);

    return NextResponse.json(ingredient);
  } catch (error: any) {
    console.error("Create ingredient error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

