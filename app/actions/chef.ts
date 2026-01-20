'use server'

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/auth-options"

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Security Helper ---
// Helper to check role and get the Authorization header for the backend
async function getAuthHeader() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== "CHEF" && session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized Access")
  }

  // @ts-ignore: Assuming accessToken exists on user from your NextAuth config
  const token = session?.user?.accessToken;

  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    user: session.user
  };
}

export async function updateOrderStatus(orderId: string, newStatus: 'COOKING' | 'READY' | 'SERVED') {
  try {
    const { headers, user } = await getAuthHeader();

    // Prepare payload
    // If chef starts cooking, we send their ID to assign the ticket
    const payload = {
      id: orderId,
      status: newStatus,
      chefId: newStatus === 'COOKING' ? user.id : undefined 
    };

    const res = await fetch(`${API_URL}/orders`, {
      method: "PUT", // Matches your ordersController 'update' logic
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Backend responded with ${res.status}`);
    }

    // Revalidate the chef's view 
    revalidatePath("/chef/orders");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { error: "Failed to update order" };
  }
}

export async function updateStockCount(ingredientId: string, quantity: number, branchId: string) {
  try {
    const { headers } = await getAuthHeader();

    // Call Backend Inventory Endpoint
    // Assuming you have a route like PUT /stock or PATCH /ingredients/:id
    const res = await fetch(`${API_URL}/stock`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        ingredientId,
        branchId,
        quantity
      })
    });

    if (!res.ok) {
      throw new Error("Failed to update stock");
    }
    
    revalidatePath("/chef/inventory");
    return { success: true };
  } catch (error) {
    console.error("Failed to update stock:", error);
    return { error: "Failed to update inventory" };
  }
}