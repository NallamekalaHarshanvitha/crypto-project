import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCoinData,
  fetchChartData as fetchChartDataApi,
} from "../../api/coinGecko";

// Replaces loadCoinData() in CoinDetail.jsx
export const fetchCoinDetail = createAsyncThunk(
  "coinDetail/fetchCoinDetail",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchCoinData(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Replaces loadChartData() in CoinDetail.jsx — the date/price formatting
// that used to happen after setChartData now happens here, once, in the thunk.
export const fetchCoinChart = createAsyncThunk(
  "coinDetail/fetchCoinChart",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchChartDataApi(id);
      return data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price[1].toFixed(2),
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  coin: null,
  chartData: [],
  status: "idle", // tracks the main coin fetch (drives the loading screen)
  error: null,
};

const coinDetailSlice = createSlice({
  name: "coinDetail",
  initialState,
  reducers: {
    // Dispatched on unmount / id change so switching coins doesn't
    // briefly show the previous coin's data.
    clearCoinDetail(state) {
      state.coin = null;
      state.chartData = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoinDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coin = action.payload;
      })
      .addCase(fetchCoinDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch coin data";
      })
      .addCase(fetchCoinChart.fulfilled, (state, action) => {
        state.chartData = action.payload;
      })
      .addCase(fetchCoinChart.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to fetch chart data";
      });
  },
});

export const { clearCoinDetail } = coinDetailSlice.actions;

// --- Selectors ---
export const selectCoin = (state) => state.coinDetail.coin;
export const selectChartData = (state) => state.coinDetail.chartData;
export const selectCoinStatus = (state) => state.coinDetail.status;
export const selectCoinError = (state) => state.coinDetail.error;

export default coinDetailSlice.reducer;
