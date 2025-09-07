import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/users/${id}`);
        // Handle flat vs nested API responses
        const u = data?.user ?? data;

        if (!u || (!u.name && !u.email)) {
          throw new Error("User not found");
        }

        setName(u.name ?? "");
        setEmail(u.email ?? "");
        setIsAdmin(Boolean(u.isAdmin));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err?.response?.data?.message || err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await api.put(`/users/${id}`, { name, email, isAdmin });
      navigate("/admin/users");
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err?.response?.data?.message || "Failed to update user");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>

      {error && (
        <p className="mb-4 text-red-600 text-sm">{error}</p>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            id="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isAdmin" className="font-semibold">Is Admin</label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UserEdit;