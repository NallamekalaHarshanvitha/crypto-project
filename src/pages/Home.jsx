import { Link } from "react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptoCard } from "../components/CryptoCard";
import {
  useCreateCoinMutation,
  useDeleteCoinMutation,
  useGetCryptosQuery,
  useUpdateCoinMutation,
} from "../api/cryptoApi";
import {
  setViewMode,
  setSortBy,
  setSearchQuery,
  selectFilteredSortedList,
  selectViewMode,
  selectSortBy,
  selectSearchQuery,
} from "../features/crypto/cryptoSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const {
    data: cryptos = [],
    isLoading,
    error,
  } = useGetCryptosQuery(undefined, { pollingInterval: 3000 });

  const filteredList = useSelector((state) =>
    selectFilteredSortedList(state, cryptos)
  );
  const viewMode = useSelector(selectViewMode);
  const sortBy = useSelector(selectSortBy);
  const searchQuery = useSelector(selectSearchQuery);
  const [createCoin, { isLoading: isCreating }] = useCreateCoinMutation();
  const [updateCoin, { isLoading: isUpdating }] = useUpdateCoinMutation();
  const [deleteCoin, { isLoading: isDeleting }] = useDeleteCoinMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [draft, setDraft] = useState({
    name: "",
    symbol: "",
    image: "",
    current_price: "",
  });
  const [mutationError, setMutationError] = useState("");

  const openCreateForm = () => {
    setEditingCoin(null);
    setDraft({ name: "", symbol: "", image: "", current_price: "" });
    setMutationError("");
    setFormOpen(true);
  };

  const openEditForm = (coin) => {
    setEditingCoin(coin);
    setDraft({
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: String(coin.current_price),
    });
    setMutationError("");
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const price = Number(draft.current_price);

    if (!draft.name.trim() || !draft.symbol.trim() || !draft.image.trim()) {
      setMutationError("Name, symbol, and image URL are required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setMutationError("Enter a valid non-negative price.");
      return;
    }

    const coinFields = {
      name: draft.name.trim(),
      symbol: draft.symbol.trim().toLowerCase(),
      image: draft.image.trim(),
      current_price: price,
    };

    try {
      if (editingCoin) {
        await updateCoin({ ...editingCoin, ...coinFields }).unwrap();
      } else {
        const id = coinFields.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        if (cryptos.some((coin) => coin.id === id)) {
          setMutationError("A coin with this name already exists.");
          return;
        }

        await createCoin({
          id,
          ...coinFields,
          market_cap: 0,
          market_cap_rank: Math.max(0, ...cryptos.map((coin) => coin.market_cap_rank || 0)) + 1,
          total_volume: 0,
          high_24h: price,
          low_24h: price,
          price_change_percentage_24h: 0,
          circulating_supply: 0,
          total_supply: 0,
        }).unwrap();
      }

      setFormOpen(false);
      setEditingCoin(null);
      setMutationError("");
    } catch {
      setMutationError("Could not save this coin. Check that the API is running.");
    }
  };

  const handleDelete = async (coin) => {
    if (!window.confirm(`Delete ${coin.name} from the tracker?`)) return;

    setMutationError("");
    try {
      await deleteCoin(coin.id).unwrap();
    } catch {
      setMutationError(`Could not delete ${coin.name}. Check that the API is running.`);
    }
  };

  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
  };

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
        <button className="action-button primary" onClick={openCreateForm}>
          Add coin
        </button>
      </div>

      {formOpen && (
        <form className="coin-form" onSubmit={handleSubmit}>
          <h2>{editingCoin ? `Edit ${editingCoin.name}` : "Add a coin"}</h2>
          <div className="coin-form-fields">
            <label className="form-field">
              <span className="form-label">Name</span>
              <input
                className="form-input"
                name="name"
                value={draft.name}
                onChange={handleDraftChange}
                required
              />
            </label>
            <label className="form-field">
              <span className="form-label">Symbol</span>
              <input
                className="form-input"
                name="symbol"
                value={draft.symbol}
                onChange={handleDraftChange}
                required
              />
            </label>
            <label className="form-field">
              <span className="form-label">Image URL</span>
              <input
                className="form-input"
                name="image"
                type="url"
                value={draft.image}
                onChange={handleDraftChange}
                required
              />
            </label>
            <label className="form-field">
              <span className="form-label">Price (USD)</span>
              <input
                className="form-input"
                name="current_price"
                type="number"
                min="0"
                step="any"
                value={draft.current_price}
                onChange={handleDraftChange}
                required
              />
            </label>
          </div>
          {mutationError && <p className="field-error">{mutationError}</p>}
          <div className="form-actions">
            <button
              className="action-button primary"
              type="submit"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? "Saving..." : "Save coin"}
            </button>
            <button
              className="action-button secondary"
              type="button"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {mutationError && !formOpen && (
        <p className="mutation-error">{mutationError}</p>
      )}

      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
          <p>Loading crypto data...</p>
        </div>
      ) : error ? (
        <div className="no-results">
          <p>Unable to load cryptocurrency data.</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto) => (
            <CryptoCard
              crypto={crypto}
              key={crypto.id}
              onEdit={openEditForm}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
};