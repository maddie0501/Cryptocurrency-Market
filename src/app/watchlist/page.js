"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchMarkets } from "@/utils/api";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(saved);

    fetchMarkets().then((res) => {
      const filtered = res.data.filter((coin) => saved.includes(coin.id));
      setCoins(filtered);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-4">Loading your watchlist...</p>;

  if (!watchlist.length || coins.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">Your watchlist is empty.</p>
    );
  }

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6"> Your Watchlist</h1>

      <div className="overflow-x-auto rounded-md border shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="px-4 py-3">Coin</th>
              <th className="px-4 py-3">Price (USD)</th>
              <th className="px-4 py-3">24h %</th>
              <th className="px-4 py-3">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="border-t hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="flex items-center gap-2 px-4 py-3">
                  <Image
                    src={coin.image}
                    width={24}
                    height={24}
                    alt={coin.name}
                  />
                  <Link
                    href={`/coin/${coin.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </Link>
                </td>
                <td className="px-4 py-3">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td
                  className={`px-4 py-3 ${
                    coin.price_change_percentage_24h > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="px-4 py-3">
                  ${coin.market_cap.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href="/"
        className="text-gray-400 hover:underline font-medium text-sm"
      >
        Explore more?...
      </Link>
    </main>
  );
}
