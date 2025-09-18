import api from "../utils/api";

export async function refundOrder(orderId, amount) {
  // amount is optional (USD). If omitted, full refund is issued.
  const payload = { orderId };
  if (typeof amount === "number" && amount > 0) {
    payload.amount = amount;
  }
  const { data } = await api.post("/payments/refund", payload);
  return data; // { refund: { ... } }
}