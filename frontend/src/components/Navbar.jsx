import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetCart } from "../redux/cartSlice";
import { getUser, clearAuth, isTokenExpired } from "../utils/authStorage";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getUser());

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const syncUserFromStorage = useCallback(() => {
    setCurrentUser(getUser());
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    dispatch(resetCart());
    setCurrentUser(null);
    navigate("/login");
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    // React to cross-tab storage changes
    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") {
        syncUserFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [syncUserFromStorage]);

  useEffect(() => {
    // this one runs whenever route changes
    syncUserFromStorage();
  }, [location.pathname, syncUserFromStorage]);

  return (
    <nav className="bg-neutral text-neutral-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              E-Shop
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
            <Link to="/cart" className="relative hover:text-primary transition">
              🛒 Cart
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalQty}
                </span>
              )}
            </Link>

            {!currentUser ? (
              <>
                <Link to="/login" className="hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="hover:text-primary transition">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="hover:text-primary transition">
                  Profile
                </Link>

                {/* Admin Menu */}
                {currentUser.isAdmin && (
                  <div className="relative group">
                    <button className="hover:text-primary">Admin ▾</button>
                    <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow min-w-[150px]">
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Users
                      </Link>
                      <Link
                        to="/admin/products"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </div>
                  </div>
                )}

                <button onClick={handleLogout} className="hover:text-red-600 transition">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-neutral-dark hover:text-primary focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-neutral px-4 pb-4 space-y-2 shadow">
          <Link to="/" className="block hover:text-primary transition">
            Home
          </Link>
          <Link to="/cart" className="relative block hover:text-primary transition">
            🛒 Cart
            {totalQty > 0 && (
              <span className="absolute top-0 left-12 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>

          {!currentUser ? (
            <>
              <Link to="/login" className="block hover:text-primary transition">
                Login
              </Link>
              <Link to="/register" className="block hover:text-primary transition">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="block hover:text-primary transition">
                Profile
              </Link>

              {currentUser.isAdmin && (
                <div className="pl-4">
                  <Link to="/admin/users" className="block hover:text-primary transition">
                    Admin Users
                  </Link>
                  <Link to="/admin/products" className="block hover:text-primary transition">
                    Admin Products
                  </Link>
                  <Link to="/admin/orders" className="block hover:text-primary transition">
                    Admin Orders
                  </Link>
                </div>
              )}

              <button onClick={handleLogout} className="block hover:text-red-600 transition">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;