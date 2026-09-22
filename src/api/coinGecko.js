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

export const fetchChartData = async () => {
  return { prices: [] };
};

export const createCoin = (coin) =>
  request(`${BASE_URL}/coins`, {
    method: "POST",
    body: JSON.stringify(coin),
  });
  await createCoin({
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
        current_price: 85347,
        market_cap: 1714662023610,
        market_cap_rank: 1,
        fully_diluted_valuation: 1714662023610,
        total_volume: 62659032437,
        high_24h: 87330,
        low_24h: 81460,
        price_change_24h: 3727.44,
        price_change_percentage_24h: 4.56682,
        market_cap_change_24h: 75139395566,
        market_cap_change_percentage_24h: 4.583,
        circulating_supply: 20087781.0,
        total_supply: 20087781.0,
        max_supply: 21000000.0,
        ath: 126080,
        ath_change_percentage: -32.3069,
        ath_date: "2025-10-06T10:57:42.000Z",
        atl: 67.81,
        atl_change_percentage: 125764.39361,
        atl_date: "2013-07-05T16:00:00.000Z",
        roi: null,
        last_updated: "2026-09-22T06:58:10.000Z"
    },
  )

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
