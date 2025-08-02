import axios from "axios";
const BASE = "https://api.coingecko.com/api/v3";

export async function fetchMarkets(page = 1) {
  return axios.get(`${BASE}/coins/markets`, {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 50,
      page,
    },
  });
}

export async function fetchCoin(id) {
  return axios.get(`${BASE}/coins/${id}`);
}

export async function fetchChart(id, days) {
  return axios.get(`${BASE}/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days },
  });
}