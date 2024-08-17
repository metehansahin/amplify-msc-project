import { configureStore } from "@reduxjs/toolkit";
import reducer from "./basket/reducer";

const store = configureStore({
  reducer: {
    basket: reducer,
  },
});

export default store;
