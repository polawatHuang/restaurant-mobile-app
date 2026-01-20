// Define the shape of your data based on your Postgres table
interface Branch {
  id: number;
  name: string;
  location: string;
  managerName: string; // Adjusted to match your SQL "CONCAT" or joins
}

async function getBranches(): Promise<Branch[]> {
  // ✅ ADD THIS: Call your Node.js Backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
    cache: 'no-store', // Ensure fresh data
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Add auth if needed
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch branches');
  }

  return res.json();
}

export default async function AdminBranchesPage() {
  // Call the API function
  const branches = await getBranches();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Branches</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Branch
        </button>
      </div>

      <div className="grid gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="border p-4 rounded shadow-sm flex justify-between">
            <div>
              <h3 className="font-semibold text-lg">{branch.name}</h3>
              <p className="text-gray-500">{branch.location}</p>
            </div>
            <div className="text-right">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                Manager: {branch.managerName || 'Unassigned'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}