import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3002/" }),
  tagTypes: ["Coin"],
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: () => "coins",
      providesTags: (result) =>
        result
          ? [
              { type: "Coin", id: "LIST" },
              ...result.map(({ id }) => ({ type: "Coin", id })),
            ]
          : [{ type: "Coin", id: "LIST" }],
    }),
    getCoinData: builder.query({
      query: (id) => `coins/${id}`,
      transformResponse: (coin) => ({
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
      }),
      providesTags: (_result, _error, id) => [{ type: "Coin", id }],
    }),
    getCoinChart: builder.query({
      query: (id) => `coins/${id}`,
      transformResponse: (coin) => {
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
          const time = new Date(startTime + index * 24 * 60 * 60 * 1000)
            .toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return { time, price: price.toFixed(2) };
        });

        prices[prices.length - 1].price = currentPrice.toFixed(2);
        return prices;
      },
      providesTags: (_result, _error, id) => [{ type: "Coin", id }],
    }),
    createCoin: builder.mutation({
      query: (coin) => ({ url: "coins", method: "POST", body: coin }),
      invalidatesTags: [{ type: "Coin", id: "LIST" }],
    }),
    updateCoin: builder.mutation({
      query: ({ id, ...coin }) => ({
        url: `coins/${id}`,
        method: "PUT",
        body: { ...coin, id },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coin", id },
        { type: "Coin", id: "LIST" },
      ],
    }),
    patchCoin: builder.mutation({
      query: ({ id, ...changes }) => ({
        url: `coins/${id}`,
        method: "PATCH",
        body: changes,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Coin", id },
        { type: "Coin", id: "LIST" },
      ],
    }),
    deleteCoin: builder.mutation({
      query: (id) => ({ url: `coins/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Coin", id },
        { type: "Coin", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCoinDataQuery,
  useGetCoinChartQuery,
  useCreateCoinMutation,
  useUpdateCoinMutation,
  usePatchCoinMutation,
  useDeleteCoinMutation,
} = cryptoApi;