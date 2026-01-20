"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../CartContext';
import { Trash2, ChevronLeft, CreditCard, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, totalAmount, tableNumber, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (!tableNumber) return alert("Table number missing");
    setIsSubmitting(true);

    try {
      // 1. Structure data for your API
      const orderData = {
        userId: 1, // In a real app, this might be a Guest User ID or dynamically created
        eventId: 1, // Defaulting if your schema requires it
        quantity: 1,
        category: "Dine-In",
        priceType: "Standard",
        paymentMethod: "Pay at Counter", // or integration with Stripe
        totalAmount: totalAmount,
        status: "PENDING",
        // Pass the actual items as a JSON string or separate table depending on your DB design
        // Here we pack them into a field or you modify your Controller to accept 'items'
        // For now, I'll assume your backend can handle a generic notes/meta field or we send it but backend ignores it until updated
        excursionParticipantNames: JSON.stringify(cart), // HACK: reusing a text field for demo if DB isn't updated yet
      };

      // 2. Send to Backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error("Order failed");
      const result = await res.json();

      // 3. Success
      clearCart();
      router.push(`/dine-in/status/${result.id}`);

    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <Link href="/dine-in/menu" className="mt-4 text-orange-600 font-bold">
          Go to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col min-h-[80vh]">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dine-in/menu" className="p-2 bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">My Order</h1>
      </div>

      {/* Cart Items */}
      <div className="flex-1 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 text-orange-800 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm">
                {item.quantity}x
              </div>
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Taxes (7%)</span>
          <span>${(totalAmount * 0.07).toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
          <span>Total</span>
          <span>${(totalAmount * 1.07).toFixed(2)}</span>
        </div>
      </div>

      {/* Submit */}
      <button 
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
        className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-900 transition disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isSubmitting ? 'Sending...' : (
            <>
                <CreditCard size={20} />
                Place Order
            </>
        )}
      </button>
    </div>
  );
}