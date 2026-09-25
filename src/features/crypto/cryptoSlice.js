import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchCryptos } from "../../api/coinGecko";

// Thunk replaces the old fetchCryptoData() function in Home.jsx
export const fetchCryptoList = createAsyncThunk(
  "crypto/fetchCryptoList",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCryptos();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  list: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  // UI controls that used to be separate useState hooks in Home.jsx
  viewMode: "grid",
  sortBy: "market_cap_rank",
  searchQuery: "",
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCryptoList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCryptoList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch cryptos";
      });
  },
});

export const { setViewMode, setSortBy, setSearchQuery } = cryptoSlice.actions;

// --- Selectors ---
export const selectCryptoList = (state) => state.crypto.list;
export const selectStatus = (state) => state.crypto.status;
export const selectError = (state) => state.crypto.error;
export const selectViewMode = (state) => state.crypto.viewMode;
export const selectSortBy = (state) => state.crypto.sortBy;
export const selectSearchQuery = (state) => state.crypto.searchQuery;

// Replaces the old filterAndSort() + filteredList state in Home.jsx.
// Derived data lives in a memoized selector instead of its own state slice,
// so it can never drift out of sync with list/sortBy/searchQuery.
export const selectFilteredSortedList = createSelector(
  [selectCryptoList, selectSearchQuery, selectSortBy],
  (list, searchQuery, sortBy) => {
    const filtered = list.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });
  }
);

export default cryptoSlice.reducer;
