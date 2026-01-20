import React from 'react';

// 1. Define Interfaces
interface DailySales {
  date: string;
  total_orders: number;
  daily_revenue: number;
}

interface CategorySales {
  category: string;
  count: number;
  revenue: number;
}

interface ReportData {
  salesOverTime: DailySales[];
  salesByCategory: CategorySales[];
}

// 2. Fetcher
async function getReports(): Promise<ReportData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/sales`, {
    cache: 'no-store',
  });
  
  if (!res.ok) throw new Error('Failed to fetch reports');
  
  return res.json();
}

export default async function AdminReportsPage() {
  let data: ReportData | null = null;

  try {
    data = await getReports();
  } catch (error) {
    return <div className="p-6 text-red-500">Error loading reports.</div>;
  }

  // Calculate max value for simple CSS bar charts
  const maxRevenue = Math.max(...data.salesOverTime.map(d => Number(d.daily_revenue)), 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
           <p className="text-gray-500">Overview of sales and performance</p>
        </div>
        
        {/* Date Filter Mock */}
        <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <input type="date" className="border-none text-sm text-gray-600 focus:ring-0" />
          <span className="text-gray-400 self-center">-</span>
          <input type="date" className="border-none text-sm text-gray-600 focus:ring-0" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Filter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: Sales Over Time (Table + Visual Bars) --- */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-700">Daily Revenue (Last 30 Days)</h3>
            <button className="text-sm text-blue-600 hover:underline">Download CSV</button>
          </div>

          <div className="space-y-4">
            {data.salesOverTime.map((day, index) => {
              // Calculate width percentage for the bar
              const widthPercent = maxRevenue > 0 ? (Number(day.daily_revenue) / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center text-sm group">
                  <div className="w-24 text-gray-500 font-mono">{day.date}</div>
                  <div className="flex-1 mx-4 h-8 bg-gray-50 rounded-r-full relative overflow-hidden flex items-center">
                     {/* The CSS Bar */}
                     <div 
                       className="h-full bg-blue-100 border-r-2 border-blue-200 absolute top-0 left-0 transition-all duration-500 group-hover:bg-blue-200" 
                       style={{ width: `${widthPercent}%` }}
                     ></div>
                     <span className="relative z-10 ml-3 text-gray-700 font-medium">
                       ${Number(day.daily_revenue).toLocaleString()}
                     </span>
                  </div>
                  <div className="w-20 text-right text-gray-400 text-xs">
                    {day.total_orders} Orders
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT: Sales by Category --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h3 className="font-bold text-gray-700 mb-6">Performance by Category</h3>
          
          <div className="space-y-6">
            {data.salesByCategory.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat.category}</span>
                  <span className="font-bold text-gray-900">${Number(cat.revenue).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: '100%' }} // You could calculate % relative to total here
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{cat.count} total sales</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-blue-800 font-bold text-sm">Export Data</h4>
                <p className="text-blue-600 text-xs mt-1 mb-3">Download complete report including unpaid orders and user details.</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition">
                  Export to Excel
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}