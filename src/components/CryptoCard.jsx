import { Link } from "react-router";
import { formatPrice, formatMarketCap } from "../utils/formatter";

export const CryptoCard = ({ crypto, onEdit, onDelete, isDeleting }) => {
  return (
    <article className="crypto-card">
      <Link to={`/coin/${crypto.id}`} className="crypto-card-link">
        <div className="crypto-header">
          <div className="crypto-info">
            <img src={crypto.image} alt={crypto.name} />
            <div>
              <h3>{crypto.name}</h3>
              <p className="symbol">{crypto.symbol.toUpperCase()}</p>
              <span className="rank">#{crypto.market_cap_rank}</span>
            </div>
          </div>
        </div>

        <div className="crypto-price">
          <p className="price">{formatPrice(crypto.current_price)}</p>
          <p
            className={`change ${
              crypto.price_change_percentage_24h >= 0 ? "positive" : "negative"
            }`}
          >
            {crypto.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
          </p>
        </div>

        <div className="crypto-stats">
          <div className="stat">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              ${formatMarketCap(crypto.market_cap)}
            </span>
          </div>

          <div className="stat">
            <span className="stat-label">Volume</span>
            <span className="stat-value">
              ${formatMarketCap(crypto.total_volume)}
            </span>
          </div>
        </div>
      </Link>
      <div className="crypto-card-actions">
        <button type="button" onClick={() => onEdit(crypto)}>
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(crypto)}
          disabled={isDeleting}
        >
          Delete
        </button>
      </div>
    </article>
  );
};