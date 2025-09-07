import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Shipping() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save shipping info to localStorage (later we can sync to Redux / DB)
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ address, city, postalCode, country })
    );

    // Redirect to payment page (we will create it later)
    navigate("/payment");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
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

export default Shipping;