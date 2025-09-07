import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart, updateQty } from "../redux/cartSlice";
import { saveCartToDB } from "../redux/cartSlice";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data.products || []);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message type="error">{error}</Message>;

  const handleAddToCart = (product) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow p-4">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="rounded mb-4 hover:opacity-90 transition"
            />
            <h2 className="text-lg font-bold text-neutral-dark hover:text-primary">
              {product.name}
            </h2>
          </Link>
          <p className="text-secondary font-semibold">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="mt-2 w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;