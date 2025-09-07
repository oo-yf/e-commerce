import React from "react";

function Dashboard() {
  // temporary mock data
  const stats = {
    users: 120,
    orders: 85,
    sales: 12345.67,
  };

  const topProducts = [
    { id: 1, name: "Product A", sales: 200 },
    { id: 2, name: "Product B", sales: 150 },
    { id: 3, name: "Product C", sales: 120 },
    { id: 4, name: "Product D", sales: 90 },
    { id: 5, name: "Product E", sales: 75 },
  ];

  return (
    <div className="min-h-screen bg-gray-300 p-6">
      <h1 className="text-3xl font-bold text-neutral-dark mb-6">Admin Dashboard</h1>

      {/* Statistic cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-neutral-dark">Users</h2>
          <p className="text-2xl font-bold text-primary">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-neutral-dark">Orders</h2>
          <p className="text-2xl font-bold text-primary">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-neutral-dark">Sales</h2>
          <p className="text-2xl font-bold text-secondary">
            ${stats.sales.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Top 5 products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-neutral-dark mb-4">
          Top 5 Products
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Product</th>
              <th className="p-2">Sales</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2 text-primary font-semibold">{p.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
