import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import UsersList from "./pages/UsersList";
import UserEdit from "./pages/UserEdit";

function App() {
  return (
    <div className="min-h-screen bg-gray-300">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/shipping" 
            element={
              <PrivateRoute>
                <Shipping />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            } 
          />
          <Route
            path="/placeorder" 
            element={
              <PrivateRoute>
                <PlaceOrder />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/order/:id" 
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <UsersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <PrivateRoute>
                <UserEdit />
              </PrivateRoute>
            }
          />
        </Routes>        
      </main>
    </div>
  );
}

export default App;