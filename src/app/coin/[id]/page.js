"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCoin, fetchChart } from "@/utils/api";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

export default function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState("7");
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(saved);

    fetchCoin(id).then((res) => setCoin(res.data));
  }, [id]);

  useEffect(() => {
    fetchChart(id, range).then((res) => {
      const formatted = res.data.prices.map(([ts, price]) => ({
        time: new Date(ts).toLocaleDateString(),
        price,
      }));
      setChartData(formatted);
    });
  }, [id, range]);

  const toggleWatch = () => {
    const updated = watchlist.includes(id)
      ? watchlist.filter((i) => i !== id)
      : [...watchlist, id];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  if (!coin) return <p className="p-4 text-center">Loading coin data...</p>;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={coin.image.large}
            width={48}
            height={48}
            alt={coin.name}
          />
          <div>
            <h1 className="text-3xl font-bold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
            <p className="text-sm text-muted-foreground">
              Rank #{coin.market_cap_rank}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={toggleWatch}>
          {watchlist.includes(id) ? (
            <>
              <Star className="mr-2 w-4 h-4 fill-yellow-500" /> Unwatch
            </>
          ) : (
            <>
              <Star className="mr-2 w-4 h-4" /> Watch
            </>
          )}
        </Button>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <Card
          className="border rounded-lg transition-all duration-300 ease-in-out 
             hover:bg-green-100 hover:border-green-400 hover:shadow-md 
             hover:-translate-y-1 active:bg-green-200"
        >
          <CardHeader>
            <CardTitle>Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              ${coin.market_data.current_price.usd.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card
          className="border rounded-lg transition-all duration-300 ease-in-out 
             hover:bg-green-100 hover:border-green-400 hover:shadow-md 
             hover:-translate-y-1 active:bg-green-200"
        >
          <CardHeader>
            <CardTitle>Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              ${coin.market_data.market_cap.usd.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card
          className="border rounded-lg transition-all duration-300 ease-in-out 
             hover:bg-green-100 hover:border-green-400 hover:shadow-md 
             hover:-translate-y-1 active:bg-green-200"
        >
          <CardHeader>
            <CardTitle>24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              ${coin.market_data.total_volume.usd.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card
          className="border rounded-lg transition-all duration-300 ease-in-out 
             hover:bg-green-100 hover:border-green-400 hover:shadow-md 
             hover:-translate-y-1 active:bg-green-200"
        >
          <CardHeader>
            <CardTitle>Circulating Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {coin.market_data.circulating_supply.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white relative p-6 rounded-lg shadow-sm border space-y-4 ">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Price Chart</h2>
          <div className="flex gap-2">
            {["1", "7", "30", "90"].map((value) => (
              <button
                key={value}
                onClick={() => setRange(value)}
                className={`px-4 py-1 rounded-md text-sm border transition-all duration-200
        ${
          range === value
            ? "bg-yellow-100 text-black border-yellow-200"
            : "bg-blue-50 text-gray-800 border-gray-300 hover:bg-yellow-50"
        }
      `}
              >
                {value === "1" ? "24h" : `${value}d`}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return `${date.getDate()} ${date.toLocaleString("default", {
                    month: "short",
                  })}`;
                }}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <Tooltip
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return `${date.getDate()} ${date.toLocaleString("default", {
                    month: "short",
                  })}`;
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4f46e5"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
