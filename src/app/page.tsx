"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  Search,
  Grid,
  List,
  TrendingUp,
  TrendingDown,
  Star,
  RefreshCw,
  SlidersHorizontal,
  Clock,
  Briefcase,
  Flame,
  ArrowUpRight
} from "lucide-react";
import ApiStatus from "@/components/ApiStatus";
import StockDetailModal from "@/components/StockDetailModal";
import IndexSparkline from "@/components/IndexSparkline";
import TopPerformerBox from "@/components/TopPerformerBox";
import WorstPerformerBox from "@/components/WorstPerformerBox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StockInfo } from "@/lib/stockCache";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data, error, isLoading, mutate } = useSWR("/api/stocks", fetcher, {
    refreshInterval: 4000, // refresh price tick list every 4 seconds
    revalidateOnFocus: true
  });

  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "gainers" | "losers" | "watchlist">("all");
  const [sortBy, setSortBy] = useState<"symbol" | "price" | "change" | "volume" | "marketCap">("change");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const [marketOpen, setMarketOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nse_watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read watchlist from localStorage", e);
    }
  }, []);

  // Update IST market status and time string
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      // Convert to India Standard Time (IST)
      const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      
      const day = istTime.getDay(); // 0 is Sunday, 6 is Saturday
      const hour = istTime.getHours();
      const minute = istTime.getMinutes();
      const timeVal = hour * 100 + minute;

      const isWeekday = day >= 1 && day <= 5;
      const isTradingHours = timeVal >= 915 && timeVal <= 1530; // 9:15 AM to 3:30 PM IST
      
      setMarketOpen(isWeekday && isTradingHours);

      const timeString = istTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short"
      });
      setCurrentTimeStr(timeString);
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation(); // prevent card click
    let updated: string[];
    if (watchlist.includes(symbol)) {
      updated = watchlist.filter((s) => s !== symbol);
    } else {
      updated = [...watchlist, symbol];
    }
    setWatchlist(updated);
    localStorage.setItem("nse_watchlist", JSON.stringify(updated));
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const stocks: StockInfo[] = data?.data || [];
  const apiStatus = data?.apiStatus || "SIMULATED";

  // Filter stocks based on Search + Tabs
  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTab === "gainers") return stock.changePercent > 0;
    if (selectedTab === "losers") return stock.changePercent < 0;
    if (selectedTab === "watchlist") return watchlist.includes(stock.symbol);
    return true;
  });

  // Sort stocks
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    let aVal: any = a[sortBy];
    let bVal: any = b[sortBy];

    if (typeof aVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  // Gainers/Losers Highlights
  const topGainers = [...stocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3);
  const topLosers = [...stocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3);

  const formatVolume = (vol: number) => {
    if (vol >= 10000000) {
      return `${(vol / 10000000).toFixed(2)} Cr`;
    } else if (vol >= 100000) {
      return `${(vol / 100000).toFixed(2)} L`;
    }
    return vol.toLocaleString("en-IN");
  };

  const formatMarketCap = (capInLakhCrore: number) => {
    if (capInLakhCrore >= 100000) {
      return `₹${(capInLakhCrore / 100000).toFixed(2)} L Cr`;
    }
    return `₹${capInLakhCrore.toLocaleString("en-IN")} Cr`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Ticker Tape */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800/60 overflow-hidden py-2 text-xs relative select-none flex">
        <div className="flex w-max animate-marquee whitespace-nowrap space-x-10 hover:[animation-play-state:paused] px-4">
          {stocks.concat(stocks).map((stock, i) => (
            <div
              key={i}
              onClick={() => setActiveSymbol(stock.symbol)}
              className="inline-flex items-center space-x-2 cursor-pointer hover:text-white transition-colors"
            >
              <span className="font-extrabold text-zinc-300">{stock.symbol.split(".")[0]}</span>
              <span className="font-bold">₹{stock.price.toFixed(2)}</span>
              <span
                className={`inline-flex items-center font-bold text-[10px] ${
                  stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Theme Toggle underneath ticker */}
      <div className="mt-4 px-4 sm:px-6 w-full max-w-7xl mx-auto flex justify-end">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/25">
                <Briefcase className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">StockWise</h1>
                <p className="text-xs text-zinc-400 font-medium">Real-time NSE Financial Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Market Clock Status */}
            <div className="flex items-center space-x-2 bg-zinc-900/60 px-3.5 py-1.5 rounded-full border border-zinc-800">
              <Clock className={`w-4 h-4 shrink-0 ${marketOpen ? "text-emerald-400" : "text-zinc-500"}`} />
              <span className="text-xs font-bold text-zinc-300">{currentTimeStr || "Loading..."}</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  marketOpen
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                    : "bg-rose-950 text-rose-400 border border-rose-900"
                }`}
              >
                {marketOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>

            {/* API Status Badge */}
            <ApiStatus status={apiStatus} />

            {/* Refresh Button */}
            <button
              onClick={() => mutate()}
              disabled={isLoading}
              className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all active:scale-95 disabled:opacity-50 touch-manipulation"
              title="Refresh Quotes"
            >
              <RefreshCw className={`w-4 h-4 shrink-0 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Indices Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading && stocks.length === 0 ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 animate-pulse flex justify-between items-center">
                <div className="space-y-3 w-1/2">
                  <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
                  <div className="h-8 bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                </div>
                <div className="h-16 w-32 bg-zinc-850 rounded-xl"></div>
              </div>
            ))
          ) : (
            Object.entries(data?.indices || {}).map(([key, idx]: [string, any]) => {
              const isPositive = idx.change >= 0;
              return (
                <div
                  key={key}
                  className="relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-900 hover:border-zinc-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md flex justify-between items-center group transition-all duration-300"
                >
                  <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500 group-hover:scale-125 ${
                    isPositive ? "bg-emerald-500" : "bg-rose-500"
                  }`} />
                  
                  <div className="space-y-2 z-10">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Benchmark Index</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        idx.apiSource === "LIVE" 
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30" 
                          : "bg-amber-950/60 text-amber-400 border border-amber-800/30"
                      }`}>
                        {idx.apiSource}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight leading-none group-hover:text-emerald-400/90 transition-colors">
                      {idx.name}
                    </h2>
                    
                    <div className="flex items-baseline space-x-3">
                      <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {idx.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`inline-flex items-center text-xs font-extrabold ${
                        isPositive ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {isPositive ? "+" : ""}
                        {idx.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    
                    <p className={`text-[10px] font-bold flex items-center space-x-1 ${
                      isPositive ? "text-emerald-500/80" : "text-rose-500/80"
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>
                        {isPositive ? "Up" : "Down"} {Math.abs(idx.change).toFixed(2)} points today
                      </span>
                    </p>
                  </div>
                  
                  <div className="z-10 flex flex-col items-end space-y-1">
                    <IndexSparkline history={idx.history} isPositive={isPositive} />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mr-2">Today's Trend</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Top Performer Horizontal Box */}
        <TopPerformerBox stocks={stocks} />

        {/* Worst Performer Horizontal Box */}
        <WorstPerformerBox stocks={stocks} />

        {/* Top Movers Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gainers Panel */}
          <div className="bg-zinc-900/40 rounded-2xl border border-zinc-900 p-4 space-y-3">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-400 shrink-0" />
              Top Gainers
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {isLoading && stocks.length === 0
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-zinc-900/60 border border-zinc-850 rounded-xl animate-pulse"></div>
                  ))
                : topGainers.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => setActiveSymbol(stock.symbol)}
                      className="bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-850 hover:border-emerald-500/20 p-2.5 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">
                          {stock.symbol.split(".")[0]}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs font-bold text-zinc-200 mt-1.5">₹{stock.price.toFixed(2)}</p>
                      <p className="text-[10px] font-black text-emerald-400 mt-0.5">
                        +{stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  ))}
            </div>
          </div>

          {/* Losers Panel */}
          <div className="bg-zinc-900/40 rounded-2xl border border-zinc-900 p-4 space-y-3">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
              Top Losers
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {isLoading && stocks.length === 0
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-zinc-900/60 border border-zinc-850 rounded-xl animate-pulse"></div>
                  ))
                : topLosers.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => setActiveSymbol(stock.symbol)}
                      className="bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-850 hover:border-rose-500/20 p-2.5 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-white group-hover:text-rose-400 transition-colors">
                          {stock.symbol.split(".")[0]}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs font-bold text-zinc-200 mt-1.5">₹{stock.price.toFixed(2)}</p>
                      <p className="text-[10px] font-black text-rose-400 mt-0.5">
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-zinc-900/30 rounded-2xl border border-zinc-900/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab Switcher */}
          <div className="flex space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850 max-w-full overflow-x-auto scrollbar-none">
            {[
              { id: "all", label: "All Stocks" },
              { id: "gainers", label: "Gainers" },
              { id: "losers", label: "Losers" },
              { id: "watchlist", label: "Watchlist", icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center space-x-1.5 ${
                    selectedTab === tab.id
                      ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/50"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${watchlist.length > 0 && tab.id === "watchlist" ? "fill-amber-400 text-amber-400" : ""}`} />}
                  <span>{tab.label}</span>
                  {tab.id === "watchlist" && watchlist.length > 0 && (
                    <span className="bg-amber-400 text-zinc-950 font-extrabold text-[9px] px-1.5 py-0.2 rounded-full">
                      {watchlist.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search and Layout Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                placeholder="Search stocks by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-800 focus:border-zinc-700 text-xs rounded-xl pl-9 pr-4 py-2 text-white focus:outline-none placeholder-zinc-500 transition-colors"
              />
            </div>

            {/* Layout Toggles */}
            <div className="flex border border-zinc-850 rounded-xl bg-zinc-950 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4 shrink-0" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="List View"
              >
                <List className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters / Results Info */}
        <div className="flex justify-between items-center text-xs text-zinc-500 font-medium">
          <div>
            Showing {sortedStocks.length} of {stocks.length} stocks
          </div>
          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sorted by:</span>
            <button onClick={() => toggleSort("change")} className={`font-bold hover:text-white ${sortBy === "change" ? "text-emerald-400" : ""}`}>
              % Change
            </button>
            <span>•</span>
            <button onClick={() => toggleSort("price")} className={`font-bold hover:text-white ${sortBy === "price" ? "text-emerald-400" : ""}`}>
              Price
            </button>
            <span>•</span>
            <button onClick={() => toggleSort("volume")} className={`font-bold hover:text-white ${sortBy === "volume" ? "text-emerald-400" : ""}`}>
              Vol
            </button>
          </div>
        </div>

        {/* Empty Watchlist State */}
        {selectedTab === "watchlist" && watchlist.length === 0 && (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 space-y-3">
            <Star className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-400">Your watchlist is empty.</p>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Tap the star icon on any stock card to track it here.
            </p>
          </div>
        )}

        {/* Stock Display List */}
        {isLoading && stocks.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 animate-pulse space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
                  <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
                <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedStocks.map((stock) => {
                  const isStockPositive = stock.change >= 0;
                  const isStarred = watchlist.includes(stock.symbol);
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => setActiveSymbol(stock.symbol)}
                      className="bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between h-36"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-black text-white text-sm tracking-tight group-hover:text-emerald-400 transition-colors">
                              {stock.symbol.split(".")[0]}
                            </span>
                            <span className="text-[9px] font-bold text-zinc-500">{stock.sector}</span>
                          </div>
                          <h3 className="text-xs text-zinc-400 font-medium truncate max-w-[130px] mt-0.5">
                            {stock.name}
                          </h3>
                        </div>

                        {/* Watchlist Toggle */}
                        <button
                          onClick={(e) => toggleWatchlist(e, stock.symbol)}
                          className="p-1.5 text-zinc-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-zinc-800/40 touch-manipulation"
                        >
                          <Star className={`w-4 h-4 shrink-0 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <p className="text-[10px] text-zinc-500 font-semibold uppercase">Market Price</p>
                          <p className="text-base font-extrabold text-white">₹{stock.price.toFixed(2)}</p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-black ${
                              isStockPositive
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                                : "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                            }`}
                          >
                            {isStockPositive ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-zinc-900/25 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-900 text-[10px] text-zinc-500 uppercase font-black bg-zinc-950/30">
                        <th className="py-3 px-4 w-12 text-center">Watch</th>
                        <th className="py-3 px-4">Ticker</th>
                        <th className="py-3 px-4 hidden sm:table-cell">Company Name</th>
                        <th className="py-3 px-4 text-right">Price (₹)</th>
                        <th className="py-3 px-4 text-right">Change (%)</th>
                        <th className="py-3 px-4 text-right hidden md:table-cell">Volume</th>
                        <th className="py-3 px-4 text-right hidden lg:table-cell">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-xs">
                      {sortedStocks.map((stock) => {
                        const isStockPositive = stock.change >= 0;
                        const isStarred = watchlist.includes(stock.symbol);
                        return (
                          <tr
                            key={stock.symbol}
                            onClick={() => setActiveSymbol(stock.symbol)}
                            className="hover:bg-zinc-900/40 cursor-pointer transition-colors active:bg-zinc-900"
                          >
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={(e) => toggleWatchlist(e, stock.symbol)}
                                className="p-1 text-zinc-600 hover:text-amber-400 transition-colors"
                              >
                                <Star className={`w-4 h-4 shrink-0 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                              </button>
                            </td>
                            <td className="py-3 px-4 font-black text-white">
                              <div>
                                <span>{stock.symbol.split(".")[0]}</span>
                                <span className="text-[9px] text-zinc-500 font-medium ml-2 sm:hidden block">
                                  {stock.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-zinc-400 hidden sm:table-cell font-medium truncate max-w-xs">
                              {stock.name}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-white">
                              ₹{stock.price.toFixed(2)}
                            </td>
                            <td className={`py-3 px-4 text-right font-black ${
                              isStockPositive ? "text-emerald-400" : "text-rose-400"
                            }`}>
                              {isStockPositive ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 text-right text-zinc-400 hidden md:table-cell font-medium">
                              {formatVolume(stock.volume)}
                            </td>
                            <td className="py-3 px-4 text-right text-zinc-400 hidden lg:table-cell font-medium">
                              {formatMarketCap(stock.marketCap)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Stock Detailed View Drawer/Modal */}
      {activeSymbol && (
        <StockDetailModal symbol={activeSymbol} onClose={() => setActiveSymbol(null)} />
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900 text-center text-xs text-zinc-500 font-medium space-y-4">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-2">
          <Link href="/about-us" className="hover:text-emerald-400 transition-colors">About Us</Link>
          <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
          <Link href="/contact-us" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
        </div>
        <p className="text-[10px] text-zinc-600">© 2026 StockWise India Inc. All rights reserved. Real-time indicators simulated for demonstrations.</p>
        <p className="text-[10px] text-zinc-600 mt-1">Built with Next.js App Router, Tailwind CSS, Recharts, and SWR.</p>
      </footer>
    </div>
  );
}
