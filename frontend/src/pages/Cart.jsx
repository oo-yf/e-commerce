import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, updateQty, saveCartToDB } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const syncCart = () => {
    setTimeout(() => {
      const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      dispatch(saveCartToDB(currentCart));
    }, 0);
  };

  const handleQtyChange = (id, qty) => {
    dispatch(updateQty({ id, qty }));
    syncCart();
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    syncCart();
  };

  const handleClear = () => {
    dispatch(clearCart());
    setTimeout(() => {
      dispatch(saveCartToDB([]));
    }, 0);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-300 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">
          Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <EmptyState message="Your cart is empty." buttonText="Continue Shopping" buttonLink="/" />
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <div>
                  <h3 className="text-lg font-semibold text-neutral-dark">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">${item.price}</p>
                  <select
                    value={item.qty}
                    onChange={(e) => handleQtyChange(item._id, Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 mt-1"
                  >
                    {[...Array(item.countInStock || 10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-bold text-secondary">
                    ${(item.qty * item.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <h3 className="text-xl font-bold text-neutral-dark">Total</h3>
              <p className="text-xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleClear}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
              >
                Clear Cart
              </button>
              <button 
                onClick={() => navigate("/shipping")}
                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
              >               
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;