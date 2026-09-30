import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
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
});

export const { setViewMode, setSortBy, setSearchQuery } = cryptoSlice.actions;

export const selectViewMode = (state) => state.crypto.viewMode;
export const selectSortBy = (state) => state.crypto.sortBy;
export const selectSearchQuery = (state) => state.crypto.searchQuery;

export const selectFilteredSortedList = createSelector(
  [
    (_state, list = []) => list,
    selectSearchQuery,
    selectSortBy,
  ],
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
