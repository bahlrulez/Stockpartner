"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { HistoricalDataPoint } from "@/lib/stockCache";

interface StockChartProps {
  history: HistoricalDataPoint[];
  isPositive: boolean;
}

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y";

export default function StockChart({ history, isPositive }: StockChartProps) {
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<TimeRange>("1M");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !history || history.length === 0) {
    return (
      <div className="h-64 w-full bg-zinc-900/50 rounded-xl flex items-center justify-center border border-zinc-800 animate-pulse">
        <span className="text-zinc-500 text-sm">Loading chart...</span>
      </div>
    );
  }

  // Filter history based on range
  const getFilteredData = () => {
    switch (range) {
      case "1D":
        // Simulated intraday ticks, let's take the last 5 points
        return history.slice(-5);
      case "1W":
        return history.slice(-7);
      case "1M":
        return history.slice(-30);
      case "3M":
        // For this demo, since we generate 30 days of data, 3M/1Y will just show the available data
        return history;
      case "1Y":
        return history;
      default:
        return history;
    }
  };

  const chartData = getFilteredData();
  const strokeColor = isPositive ? "#10b981" : "#f43f5e"; // Emerald-500 vs Rose-500
  const fillColor = isPositive ? "url(#colorUp)" : "url(#colorDown)";

  // Format date for Axis
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch {
      return dateStr;
    }
  };

  // Find min and max for Y-Axis domain padding
  const prices = chartData.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const domainMin = Math.floor(minPrice * 0.98); // 2% padding
  const domainMax = Math.ceil(maxPrice * 1.02); // 2% padding

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex space-x-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80 w-fit">
        {(["1D", "1W", "1M", "3M", "1Y"] as TimeRange[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
              range === r
                ? "bg-zinc-800 text-white shadow-md border border-zinc-700/50"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 w-full bg-zinc-950/40 p-2 sm:p-4 rounded-xl border border-zinc-800/60 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#4b5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              domain={[domainMin, domainMax]}
              stroke="#4b5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as HistoricalDataPoint;
                  return (
                    <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
                      <p className="text-xs text-zinc-400 font-semibold mb-1">
                        {new Date(data.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">
                          Price: <span className="text-zinc-100">₹{data.close.toFixed(2)}</span>
                        </p>
                        <p className="text-xs text-zinc-400">
                          Open: <span className="text-zinc-300">₹{data.open.toFixed(2)}</span>
                        </p>
                        <p className="text-xs text-zinc-400">
                          High: <span className="text-zinc-300">₹{data.high.toFixed(2)}</span> | Low: <span className="text-zinc-300">₹{data.low.toFixed(2)}</span>
                        </p>
                        <p className="text-xs text-zinc-500">
                          Vol: {data.volume.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                }
                  return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={fillColor}
              activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
