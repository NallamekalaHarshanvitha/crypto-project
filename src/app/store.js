import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "../features/crypto/cryptoSlice";
import coinDetailReducer from "../features/coinDetail/coinDetailSlice";

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    coinDetail: coinDetailReducer,
  },
});
