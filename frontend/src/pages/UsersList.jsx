import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users"); // GET /api/users (admin only)
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`); // DELETE /api/users/:id
        setUsers(users.filter((u) => u._id !== id)); // update state
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Admin</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-2">{user._id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {user.isAdmin ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="p-2">
                  <Link
                    to={`/admin/users/${user._id}/edit`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  {!user.isAdmin && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deleteHandler(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersList;