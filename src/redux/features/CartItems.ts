import { createSlice } from "@reduxjs/toolkit";

interface cartItemsI {
  id: number;
  quantity: number;
}

interface cartValue {
  cartItemSet: cartItemsI[];
  total: number;
}

const cartItems: cartValue = {
  cartItemSet: [],
  total: 0
};

export const CartItemsSlice = createSlice({
  name: "cartItems",
  initialState: { value: cartItems },
  reducers: {
    addToCart: (state, action) => {
      // console.log(state.value);
      // console.log(cartItems);
      const currentItem = state.value.cartItemSet.find(
        (item: cartItemsI) => item.id === action.payload
      );

      if (currentItem) {
        currentItem.quantity += 1;
      } else {
        state.value.cartItemSet.push({ id: action.payload, quantity: 1 });
        // console.log(state.value);
      }
    },

    removeFromCart: (state, action) => {
      const currentItem = state.value.cartItemSet.find(
        (item) => item.id === action.payload
      );

      if (currentItem) {
        if (currentItem.quantity === 1) {
          // console.log(currentItem);

          const newItemas = state.value.cartItemSet.filter(
            (item) => item.id !== action.payload
          );
          // console.log(newItemas);
          state.value.cartItemSet = newItemas;
        } else {
          currentItem.quantity -= 1;
        }
      }
    },

    setTotal: (state, action) => {
      state.value.total += action.payload;
    }
  }
});
export const { addToCart, removeFromCart, setTotal } = CartItemsSlice.actions;
export default CartItemsSlice.reducer;
