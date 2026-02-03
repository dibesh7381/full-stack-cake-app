import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// 🛒 fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const res = await axios.get(`${BASE_URL}/cart`, {
      headers: getHeaders(),
    });
    return res.data.data || [];
  }
);

// ➕ ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cakeId, { dispatch }) => {
    await axios.post(
      `${BASE_URL}/cart/add`,
      { cakeId },
      { headers: getHeaders() }
    );
    dispatch(fetchCart());
  }
);

// ➕➖ update quantity
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cakeId, quantity }, { dispatch }) => {
    await axios.put(
      `${BASE_URL}/cart/quantity`,
      { cakeId, quantity },
      { headers: getHeaders() }
    );
    dispatch(fetchCart());
  }
);

// ❌ remove item
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (cakeId, { dispatch }) => {
    await axios.delete(`${BASE_URL}/cart/item/${cakeId}`, {
      headers: getHeaders(),
    });
    dispatch(fetchCart());
  }
);

// 🧹 clear cart (backend)
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch }) => {
    await axios.delete(`${BASE_URL}/cart/clear`, {
      headers: getHeaders(),
    });
    dispatch(fetchCart());
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },

  // 🔥 ADD THIS
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  },
});

// 🔥 export resetCart
export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
