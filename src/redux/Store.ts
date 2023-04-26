import { configureStore } from "@reduxjs/toolkit";
import cartItemReducer from "./features/CartItems";
import statusVarReducer from "./features/StatusVar";
import globalDataReducer from "./features/GlobalData";
const Store = configureStore({
  reducer: {
    cartItem: cartItemReducer,
    statusVar: statusVarReducer,
    globalData: globalDataReducer
  }
});

export default Store;
