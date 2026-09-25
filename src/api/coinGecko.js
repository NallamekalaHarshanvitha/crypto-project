const BASE_URL = "http://localhost:3002";

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
};

export const fetchCryptos = async () => {
  return request(`${BASE_URL}/coins`);
};

export const fetchCoinData = async (id) => {
  const coin = await request(`${BASE_URL}/coins/${id}`);

  return {
    ...coin,
    image: { large: coin.image },
    market_data: {
      current_price: { usd: coin.current_price },
      high_24h: { usd: coin.high_24h },
      low_24h: { usd: coin.low_24h },
      market_cap: { usd: coin.market_cap },
      total_volume: { usd: coin.total_volume },
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
    },
  };
};

export const fetchChartData = async (id) => {
  const coin = await request(`${BASE_URL}/coins/${id}`);
  const currentPrice = Number(coin.current_price);
  const lowPrice = Number(coin.low_24h);
  const highPrice = Number(coin.high_24h);

  if (![currentPrice, lowPrice, highPrice].every(Number.isFinite)) {
    throw new Error("Coin does not contain enough data for a price chart");
  }

  const startTime = Date.now() - 6 * 24 * 60 * 60 * 1000;
  const prices = Array.from({ length: 7 }, (_, index) => {
    const progress = index / 6;
    const trendPrice = lowPrice + (currentPrice - lowPrice) * progress;
    const wave = Math.sin(index * 1.7) * (highPrice - lowPrice) * 0.15;
    const price = Math.min(highPrice, Math.max(lowPrice, trendPrice + wave));

    return [startTime + index * 24 * 60 * 60 * 1000, price];
  });

  prices[prices.length - 1][1] = currentPrice;
  return { prices };
};

export const createCoin = (coin) =>
  request(`${BASE_URL}/coins`, {
    method: "POST",
    body: JSON.stringify(coin),
  });

export const updateCoin = (id, coin) =>
  request(`${BASE_URL}/coins/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...coin, id }),
  });

export const patchCoin = (id, changes) =>
  request(`${BASE_URL}/coins/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });

export const deleteCoin = (id) =>
  request(`${BASE_URL}/coins/${id}`, { method: "DELETE" });