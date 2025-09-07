import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCartFromDB } from "../redux/cartSlice";
import api from "../utils/api";
import { setAuth } from "../utils/authStorage";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Normalize backend response
      const token =
        data.token || data.accessToken || data.jwt || data?.data?.token;
      const userObj =
        data.user || {
          _id: data._id ?? data.id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
        };

      // Save token and user in localStorage
      setAuth({ token, user: userObj });

      // Load cart after login
      dispatch(loadCartFromDB());

      // Redirect to home
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
          Login
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-neutral-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-neutral-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;