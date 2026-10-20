import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getProductPrice } from '@/lib/productPricing';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        toast.info("Already added to Cart")
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
        });
        toast.success('Added to cart successfully')
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item.id !== action.payload
      );
    },

   incrementItem: (state, action) => {
      const item = state.cartItems.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1
      }
    },
    decrementItem:(state, action) => {
        const existingItem = state.cartItems.find(item => item.id === action.payload)
        if(existingItem && existingItem.quantity > 1){
            existingItem.quantity -= 1
        }else if (existingItem  && existingItem.quantity === 1){
            state.cartItems = state.cartItems.filter(cartItem => cartItem.id !== action.payload);
        }
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, incrementItem, decrementItem, clearCart } = cartSlice.actions;

// Use the same effective unit price for cart and checkout totals.
export const selectCartItems = (state) => state.persistedReducer.cart.cartItems;

export const selectCartTotal = (state) => 
  state.persistedReducer.cart.cartItems.reduce(
    (total, item) => total + (getProductPrice(item) * item.quantity),
    0
  );

export default cartSlice.reducer;
