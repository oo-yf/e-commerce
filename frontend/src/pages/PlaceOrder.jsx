import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data from Redux / LocalStorage
  const { cartItems } = useSelector((state) => state.cart);
  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress")) || {};
  const paymentMethod = localStorage.getItem("paymentMethod") || "Stripe";

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const placeOrderHandler = async () => {
    try {
      const token = localStorage.getItem("token"); // user JWT
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice: totalPrice,
          totalPrice,
        },
        config
      );

      // Redirect to order details page
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8 space-y-6">
      <h2 className="text-2xl font-bold">Place Order</h2>

      {/* Shipping */}
      <div>
        <h3 className="font-semibold">Shipping</h3>
        <p>{shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}</p>
      </div>

      {/* Payment */}
      <div>
        <h3 className="font-semibold">Payment Method</h3>
        <p>{paymentMethod}</p>
      </div>

      {/* Items */}
      <div>
        <h3 className="font-semibold">Order Items</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between border-b pb-2">
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.qty} × ${item.price}
                  </p>
                </div>
                <p className="font-semibold">${(item.qty * item.price).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t pt-4">
        <h3 className="text-xl font-bold">Total</h3>
        <p className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={placeOrderHandler}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
      >
        Place Order
      </button>
    </div>
  );
}

export default PlaceOrder;