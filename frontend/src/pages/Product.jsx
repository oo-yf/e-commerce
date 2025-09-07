import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart, updateQty } from "../redux/cartSlice";
import { saveCartToDB } from "../redux/cartSlice";

function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Message type="error">{error}</Message>;
  if (!product) return <Message type="warning">Product not found.</Message>;

  const handleAddToCart = () => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      dispatch(updateQty({ id: product._id, qty: existItem.qty + 1 }));
    } else {
      dispatch(addToCart({ ...product, qty: 1 }));
    }

    // save latest cart to DB
    setTimeout(() => {
      const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      dispatch(saveCartToDB(currentCart));
    }, 0);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-300 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-4">
              {product.name}
            </h1>
            <p className="text-xl text-secondary font-semibold mb-4">
              ${product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="mb-2">
              <span className="font-semibold">Availability:</span>{" "}
              {product.countInStock > 0 ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`mt-4 w-full py-2 rounded text-white transition ${
              product.countInStock > 0
                ? "bg-primary hover:bg-primary-dark"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;