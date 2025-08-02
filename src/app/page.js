"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const [changeFilter, setChangeFilter] = useState("all");
  const [volumeFilter, setVolumeFilter] = useState("none");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    async function fetchCoins() {
      setLoading(true);
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}`
      );
      const data = await res.json();
      setCoins(data);
      setLoading(false);
    }

    fetchCoins();

    const saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(saved);
  }, [page]);

  useEffect(() => {
    let result = [...coins];

    if (search) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (rankFilter === "top5") {
      result = result.filter((coin) => coin.market_cap_rank <= 5);
    } else if (rankFilter === "top10") {
      result = result.filter((coin) => coin.market_cap_rank <= 10);
    }

    if (changeFilter === "positive") {
      result = result.filter((coin) => coin.price_change_percentage_24h > 0);
    } else if (changeFilter === "negative") {
      result = result.filter((coin) => coin.price_change_percentage_24h < 0);
    }

    if (volumeFilter === "high") {
      result.sort((a, b) => b.total_volume - a.total_volume);
    }

    setFilteredCoins(result);
  }, [search, rankFilter, changeFilter, volumeFilter, coins]);

  const toggleWatchlist = (id) => {
    let updated;
    if (watchlist.includes(id)) {
      updated = watchlist.filter((c) => c !== id);
    } else {
      updated = [...watchlist, id];
    }
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Crypto Tracker
        </h1>
        <Link
          href="/watchlist"
          className="text-blue-600 hover:underline font-medium text-sm"
        >
          ⭐ Go to Watchlist
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search coin..."
          className="p-2 border border-gray-300 rounded-md w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="all">All Ranks</option>
          <option value="top5">Top 5</option>
          <option value="top10">Top 10</option>
        </select>
        <select
          value={changeFilter}
          onChange={(e) => setChangeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="all">All % Change</option>
          <option value="positive">Positive 24h %</option>
          <option value="negative">Negative 24h %</option>
        </select>
        <select
          value={volumeFilter}
          onChange={(e) => setVolumeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="none">No Volume Sort</option>
          <option value="high">Volume High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">⏳ Loading coins...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-4 py-2">Coin</th>
                  <th className="text-left px-4 py-2">Price</th>
                  <th className="text-left px-4 py-2">24h %</th>
                  <th className="text-left px-4 py-2">Market Cap</th>
                  <th className="text-left px-4 py-2">24h Volume</th>
                  <th className="p-3 text-center">⭐</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{coin.market_cap_rank}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <Link
                        href={`/coin/${coin.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {coin.name}
                        <span className="ml-1 text-xs text-gray-400">
                          ({coin.symbol.toUpperCase()})
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        coin.price_change_percentage_24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      ${coin.total_volume.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleWatchlist(coin.id)}
                        title={
                          watchlist.includes(coin.id)
                            ? "Remove from Watchlist"
                            : "Add to Watchlist"
                        }
                        className="hover:text-yellow-500 text-lg"
                      >
                        {watchlist.includes(coin.id) ? "★" : "☆"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center text-sm">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              disabled={page === 1}
            >
              ⬅️ Previous
            </button>
            <span className="text-gray-700">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </main>
  );
}
