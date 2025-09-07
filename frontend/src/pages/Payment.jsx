import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Stripe");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save payment method (later we can sync to Redux / DB)
    localStorage.setItem("paymentMethod", paymentMethod);

    // Redirect to place order page
    navigate("/placeorder");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Stripe</span>
          </label>
        </div>
        {/* If you want to add PayPal later:
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>PayPal</span>
          </label>
        </div>
        */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default Payment;