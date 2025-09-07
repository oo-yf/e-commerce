import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserCart, saveUserCart } from "../utils/api";

// --- Thunks: async actions ---
export const loadCartFromDB = createAsyncThunk(
  "cart/loadCartFromDB",
  async () => {
    const data = await fetchUserCart();
    // Always return an array
    return Array.isArray(data) ? data : data?.items || [];
  }
);

export const saveCartToDB = createAsyncThunk(
  "cart/saveCartToDB",
  async (cartItems) => {
    const payload = cartItems.map((item) => ({
      product: item._id,
      quantity: item.qty,
    }));

    const data = await saveUserCart(payload);
    // Always return an array
    return Array.isArray(data) ? data : data?.items || [];
  }
);

// --- Load from localStorage if available ---
const storedCart = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: storedCart },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x._id === id ? { ...x, qty } : x
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    resetCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromDB.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(saveCartToDB.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      });
  },
});

export const { addToCart, removeFromCart, clearCart, updateQty, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;