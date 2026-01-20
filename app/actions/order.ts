'use server'

// No imports needed (Prisma removed)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types for the cart structure passed from client
type CartItem = {
  productId: string
  quantity: number
  price: number 
}

export async function placeOrder(branchId: string, tableId: string, cartItems: CartItem[]) {
  try {
    // 1. Prepare Payload
    // We filter down to just what the backend needs (ID and Qty).
    // The Backend MUST recalculate the total price and check stock levels on its side.
    const payload = {
      branchId,
      tableId,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      // Optional: You can send 'expectedTotal' if you want the backend to validate it,
      // but usually, the backend calculates the authoritative total.
    };

    // 2. Send to Backend API
    // We point to '/orders' (or a specific '/orders/place' endpoint depending on your routes)
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // 3. Handle Errors (e.g., "Insufficient Stock")
    if (!res.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    // 4. Success -> Return Order ID
    return { success: true, orderId: data.id || data.orderId };

  } catch (error: any) {
    console.error("Order Failed:", error);
    return { success: false, error: error.message || "Failed to place order" };
  }
}