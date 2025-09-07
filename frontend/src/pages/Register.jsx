import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", { name, email, password });

      // Save user and token to localStorage
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      // Redirect to homepage
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
          Register
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-neutral-dark mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-dark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;