import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CryptoCard } from "../components/CryptoCard";
import {
  fetchCryptoList,
  setViewMode,
  setSortBy,
  setSearchQuery,
  selectFilteredSortedList,
  selectStatus,
  selectViewMode,
  selectSortBy,
  selectSearchQuery,
} from "../features/crypto/cryptoSlice";

export const Home = () => {
  const dispatch = useDispatch();

  const filteredList = useSelector(selectFilteredSortedList);
  const status = useSelector(selectStatus);
  const viewMode = useSelector(selectViewMode);
  const sortBy = useSelector(selectSortBy);
  const searchQuery = useSelector(selectSearchQuery);

  // Only show the spinner on the very first load, same as the original
  // (which never reset isLoading back to true on the 3s poll).
  const isLoading =
    (status === "idle" || status === "loading") && filteredList.length === 0;

  useEffect(() => {
    dispatch(fetchCryptoList());
    const interval = setInterval(() => dispatch(fetchCryptoList()), 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptos..."
              className="search-input"
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              value={searchQuery}
            />
            <Link to="/profile" className="profile-button" aria-label="Open profile page">
              👤
            </Link>
          </div>
        </div>
      </header>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
          >
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => dispatch(setViewMode("grid"))}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => dispatch(setViewMode("list"))}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading crypto data...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto) => (
            <CryptoCard crypto={crypto} key={crypto.id} />
          ))}
        </div>
      )}
    </div>
  );
};