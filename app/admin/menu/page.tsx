import React from 'react';

// 1. Define Data Type
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number; // or string depending on your DB
  category: string;
  image_url: string;
  is_available: boolean;
}

// 2. Fetcher Function
async function getMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
    cache: 'no-store', // Always fresh data for admin
  });

  if (!res.ok) {
    throw new Error('Failed to fetch menu');
  }

  return res.json();
}

export default async function AdminMenuPage() {
  let menuItems: MenuItem[] = [];
  
  try {
    menuItems = await getMenu();
  } catch (err) {
    return <div className="text-red-500 p-6">Error loading menu. Is the backend running?</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-500">Manage your food and drinks</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
          + Add New Item
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span>No Image</span>
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                  item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.is_available ? 'Active' : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1">
                    {item.name}
                  </h3>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                {item.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 transition">
                  Edit
                </button>
                <button className="px-3 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}