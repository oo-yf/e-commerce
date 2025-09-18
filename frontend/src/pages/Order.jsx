import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { refundOrder } from "../api/payments";

// simple date formatter
function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(); // you can customize locale/options later
  } catch {
    return String(iso);
  }
}

function Order() {
  const { id } = useParams(); // order id from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const { userInfo } = useSelector((state) => state.auth ?? {});

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }, [id]); 

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleRefund() {
    try {
      setRefunding(true);
      // Replace `orderId` variable name if your component uses another prop/state
      const resp = await refundOrder(order._id); // full refund
      window.alert("Refund succeeded: " + resp.refund.id);
      // Refresh UI from server so the button hides and status updates
      await fetchOrder();
    } catch (e) {
      console.error(e);
      window.alert("Refund failed: " + (e?.response?.data?.message || e.message));
    } finally {
      setRefunding(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center mt-10">Order not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8 space-y-6">
      <h2 className="text-2xl font-bold">Order {order._id}</h2>

      {/* Admin-only Refund button: show only if admin, order is paid and not refunded */}
      {userInfo?.isAdmin && order?.isPaid && !order?.isRefunded && (
        <button
          onClick={handleRefund}
          disabled={refunding}
          className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-60"
        >
          {refunding ? "Refunding..." : "Refund"}
        </button>
      )}

      {/* Shipping */}
      <div>
        <h3 className="font-semibold">Shipping Address</h3>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>

      {/* Payment */}
      <div>
        <h3 className="font-semibold">Payment Method</h3>
        <p>{order.paymentMethod}</p>

        {/* Paid / Not Paid */}
        <p className="mt-1">
          {order.isPaid ? (
            <span className="text-green-600">
              Paid on {formatDate(order.paidAt)}
            </span>
          ) : (
            <span className="text-red-600">Not Paid</span>
          )}
        </p>

        {/* Refunded */}
        {order.isRefunded && (
          <p className="mt-1 text-blue-600">
            Refunded on {formatDate(order.refundedAt)}
          </p>
        )}
      </div>

      {/* Items */}
      <div>
        <h3 className="font-semibold">Order Items</h3>
        {order.orderItems.length === 0 ? (
          <p>No items in this order</p>
        ) : (
          <ul className="space-y-2">
            {order.orderItems.map((item) => (
              <li key={item.product} className="flex justify-between border-b pb-2">
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
        <p className="text-xl font-bold text-primary">${order.totalPrice}</p>
      </div>
    </div>
  );
}

export default Order;