import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiClient } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const callWaiter = await apiClient.post("/user/call-waiter", {
      ...body,
      userId: session.user.id,
      userName: session.user.name,
    });

    return NextResponse.json(callWaiter);
  } catch (error: any) {
    console.error("Call waiter error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

