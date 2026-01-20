import React from 'react';
import Link from 'next/link';

// 1. Define the shape of your Table data
interface Table {
  id: number;
  table_number: string;
  seat_capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

// 2. Fetch function replacing Prisma
async function getBranchTables(branchId: string): Promise<Table[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/${branchId}/tables`, {
    cache: 'no-store', // Always fetch fresh data for admin dashboards
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tables');
  }

  return res.json();
}

export default async function BranchTablesPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // 3. Call the API
  let tables: Table[] = [];
  try {
    tables = await getBranchTables(id);
  } catch (error) {
    return <div className="text-red-500">Error loading tables. Is the backend running?</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <Link href="/admin/branches" className="text-sm text-gray-500 hover:underline">
             ← Back to Branches
           </Link>
           <h1 className="text-2xl font-bold mt-2">Manage Tables (Branch #{id})</h1>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
          + Add Table
        </button>
      </div>

      {tables.length === 0 ? (
        <p className="text-gray-500 italic">No tables found for this branch.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div 
              key={table.id} 
              className={`border p-4 rounded-lg flex flex-col justify-between ${
                table.status === 'OCCUPIED' ? 'bg-red-50 border-red-200' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xl">T-{table.table_number}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                  table.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                }`}>
                  {table.status}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Capacity: {table.seat_capacity} ppl</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="text-blue-600 text-sm hover:underline">Edit</button>
                <button className="text-red-600 text-sm hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}