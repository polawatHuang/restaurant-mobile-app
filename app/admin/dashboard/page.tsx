import React from 'react';
import Link from 'next/link';

// 1. Define Data Types
interface DashboardStats {
  revenue: number;
  totalOrders: number;
  totalUsers: number;
  recentOrders: {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    userName: string;
  }[];
}

// 2. Fetch Data from API
async function getDashboardData(): Promise<DashboardStats> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
    cache: 'no-store', // Ensure real-time data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return res.json();
}

export default async function AdminDashboardPage() {
  let data: DashboardStats | null = null;
  
  try {
    data = await getDashboardData();
  } catch (err) {
    return <div className="p-6 text-red-500">Error: Could not load dashboard data.</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${Number(data.revenue).toLocaleString()}
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {data.totalOrders.toLocaleString()}
          </p>
        </div>

        {/* Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Registered Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {data.totalUsers.toLocaleString()}
          </p>
        </div>
      </div>

      {/* --- RECENT ORDERS TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-700">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.userName || 'Guest'}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}