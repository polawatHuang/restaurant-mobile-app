'use server'

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/auth-options"
import { z } from "zod"

// URL to your Node.js Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Security Helper ---
async function getAuthHeader() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized Access")
  }

  // Retrieve the access token stored in the session (from NextAuth callbacks)
  // @ts-ignore: Assuming you added accessToken to your session types
  const token = session?.user?.accessToken;
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

// --- Schemas ---
const CreateStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CHEF", "ADMIN"]),
  branchId: z.string().optional()
})

// --- Actions ---

export async function createStaffUser(prevState: any, formData: FormData) {
  try {
    const headers = await getAuthHeader();

    const data = Object.fromEntries(formData.entries())
    const parsed = CreateStaffSchema.safeParse(data)

    if (!parsed.success) {
      return { error: "Invalid form data" }
    }

    // 1. Send raw data to Backend (Backend handles bcrypt hashing now)
    const res = await fetch(`${API_URL}/users/staff`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to create user" }
    }
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (e) {
    console.error("Create Staff Error:", e);
    return { error: "Connection failed or unauthorized" }
  }
}

export async function createBranch(formData: FormData) {
  try {
    const headers = await getAuthHeader();
    
    const name = formData.get("name") as string
    const tables = parseInt(formData.get("tables") as string)

    // 2. Fix Bug: Pass table count to backend. 
    // The Backend will generate the Branch AND the Tables with valid IDs/QR codes in one transaction.
    const res = await fetch(`${API_URL}/branches`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        name,
        totalTables: tables, // Backend uses this to loop and create tables
        qrBaseUrl: `${process.env.NEXT_PUBLIC_URL}/dine-in` // Pass base URL so backend can append /branchId/tableId
      })
    });

    if (!res.ok) {
      throw new Error("Failed to create branch");
    }

    revalidatePath("/admin/branches")
    return { success: true }
  } catch (e) {
    console.error(e);
    return { error: "Failed to create branch" }
  }
}

export async function addMenuItem(formData: FormData) {
  try {
    const headers = await getAuthHeader();

    // extract standard fields
    const payload = {
      name: formData.get("name"),
      price: formData.get("price"),
      category: formData.get("category"),
      description: formData.get("description"),
      // For images, you usually upload to Blob storage first, get a URL, then send the URL here.
      // Or send FormData directly if your backend handles 'multipart/form-data'
      image_url: formData.get("image_url") 
    };

    const res = await fetch(`${API_URL}/menu`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to add item");

    revalidatePath("/admin/menu")
    return { success: true }
  } catch (e) {
    return { error: "Failed to add menu item" }
  }
}