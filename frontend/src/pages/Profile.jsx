import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import EmptyState from "../components/EmptyState";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        // Fetch user profile via unified axios instance
        const { data: userData } = await api.get("/users/profile");
        setUser(userData);

        // Fetch user orders
        const { data: orderData } = await api.get("/orders/myorders");
        setOrders(orderData);
      } catch (error) {
        // 401 is handled globally in api interceptor (redirect to /login)
        console.error("Profile/Orders error:", error);
        alert(error?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white shadow rounded p-4 space-y-3">
          <div className="h-6 w-32 animate-pulse bg-gray-200 rounded" />
          <div className="h-4 w-48 animate-pulse bg-gray-200 rounded" />
          <div className="h-4 w-64 animate-pulse bg-gray-200 rounded" />
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="h-6 w-40 animate-pulse bg-gray-200 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse bg-gray-200 rounded" />
            <div className="h-4 w-full animate-pulse bg-gray-200 rounded" />
            <div className="h-4 w-3/4 animate-pulse bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Do not show "not found" prematurely; return null if not ready
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Info */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="mt-2">
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>

      {/* Orders */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <EmptyState message="You have no orders yet." buttonText="Start Shopping" buttonLink="/" />
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Paid</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-2">{order._id}</td>
                  <td className="p-2">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-2">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-2">
                    {order.isPaid ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="p-2">
                    <Link to={`/order/${order._id}`} className="text-primary hover:underline">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Profile;