"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { X, TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, Bell, Activity } from "lucide-react";
import StockChart from "./StockChart";
import { StockDetail } from "@/lib/stockCache";

interface StockDetailModalProps {
  symbol: string | null;
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StockDetailModal({ symbol, onClose }: StockDetailModalProps) {
  const { data, error, isLoading } = useSWR(
    symbol ? `/api/stocks/detail?symbol=${symbol}` : null,
    fetcher,
    {
      refreshInterval: 10000, // refresh detailed quote every 10 seconds while open
      revalidateOnFocus: true
    }
  );

  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<number>(10);
  const [alertPrice, setAlertPrice] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!symbol) return null;

  const stock: StockDetail | undefined = data?.data;
  const isPositive = stock ? stock.change >= 0 : true;

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePlaceOrder = () => {
    if (!stock) return;
    const totalVal = (stock.price * quantity).toFixed(2);
    triggerToast(
      `🎉 ${tradeType} Order Executed! Successfully ${
        tradeType === "BUY" ? "bought" : "sold"
      } ${quantity} shares of ${stock.name} at ₹${stock.price} (Total: ₹${totalVal})`
    );
  };

  const handleSetAlert = () => {
    if (!alertPrice) return;
    triggerToast(
      `🔔 Price alert set for ${symbol} at ₹${alertPrice}. We will notify you when price hits this target!`
    );
    setAlertPrice("");
  };

  const formatMarketCap = (capInLakhCrore: number) => {
    if (capInLakhCrore >= 100000) {
      return `₹${(capInLakhCrore / 100000).toFixed(2)} L Cr`;
    }
    return `₹${capInLakhCrore.toLocaleString("en-IN")} Cr`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-emerald-950 border border-emerald-500/30 text-emerald-100 p-4 rounded-xl shadow-2xl flex items-start space-x-3 backdrop-blur-md animate-bounce-short">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-normal">{toastMessage}</p>
        </div>
      )}

      {/* Drawer Container */}
      <div 
        className="relative w-full sm:max-w-2xl lg:max-w-3xl bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drag Handle for Mobile */}
        <div className="flex sm:hidden justify-center py-2.5">
          <div className="w-12 h-1 bg-zinc-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 pb-4 pt-2 sm:py-5 border-b border-zinc-850 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
          {isLoading || !stock ? (
            <div className="space-y-2 w-1/2 animate-pulse">
              <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{stock.name}</h2>
                <span className="text-xs px-2 py-0.5 font-bold rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {stock.symbol.split(".")[0]}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5 ${
                  stock.apiSource === "LIVE" 
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30" 
                    : "bg-amber-950/60 text-amber-400 border border-amber-800/30"
                }`}>
                  <Activity className="w-3 h-3" />
                  {stock.apiSource}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium mt-1">{stock.sector} • NSE India</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95 touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {isLoading || !stock ? (
            <div className="space-y-6">
              {/* Chart Shimmer */}
              <div className="h-64 bg-zinc-950/40 rounded-2xl border border-zinc-800/50 flex items-center justify-center animate-pulse">
                <span className="text-zinc-600 text-xs">Loading Live Charts...</span>
              </div>
              {/* Stats Shimmer */}
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-zinc-950/30 rounded-xl border border-zinc-805/50 p-3 animate-pulse space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Price Row */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-white tracking-tight">₹{stock.price.toFixed(2)}</span>
                  <span className={`ml-3 inline-flex items-center text-sm font-bold ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 mr-1 text-emerald-400 shrink-0" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1 text-rose-400 shrink-0" />
                    )}
                    {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Live Bid</span>
              </div>

              {/* Stock Chart */}
              <StockChart history={stock.history} isPositive={isPositive} />

              {/* Stats Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Market Statistics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Open</p>
                    <p className="text-sm font-bold text-zinc-200 mt-1">₹{stock.open.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Prev Close</p>
                    <p className="text-sm font-bold text-zinc-200 mt-1">₹{stock.previousClose.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Day's High</p>
                    <p className="text-sm font-bold text-zinc-200 mt-1">₹{stock.high.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Day's Low</p>
                    <p className="text-sm font-bold text-zinc-200 mt-1">₹{stock.low.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Volume</p>
                    <p className="text-sm font-bold text-zinc-200 mt-1">{stock.volume.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-850">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Market Cap</p>
                    <p className="text-sm font-bold text-zinc-200 mt-1">{formatMarketCap(stock.marketCap)}</p>
                  </div>
                </div>
              </div>

              {/* Action Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mock Trading Panel */}
                <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mock Trading</h4>
                    <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-850">
                      <button
                        onClick={() => setTradeType("BUY")}
                        className={`px-3 py-1 text-[10px] font-bold rounded ${
                          tradeType === "BUY"
                            ? "bg-emerald-950 border border-emerald-500/20 text-emerald-400"
                            : "text-zinc-400"
                        }`}
                      >
                        BUY
                      </button>
                      <button
                        onClick={() => setTradeType("SELL")}
                        className={`px-3 py-1 text-[10px] font-bold rounded ${
                          tradeType === "SELL"
                            ? "bg-rose-950 border border-rose-500/20 text-rose-400"
                            : "text-zinc-400"
                        }`}
                      >
                        SELL
                      </button>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase block">Quantity (Shares)</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(quantity - 10)}
                        className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold text-xs active:scale-90 transition-all border border-zinc-800"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold text-xs active:scale-90 transition-all border border-zinc-800"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="flex-1 bg-zinc-950 text-center font-bold text-sm text-white rounded-lg border border-zinc-800 py-1.5 focus:outline-none focus:border-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold text-xs active:scale-90 transition-all border border-zinc-800"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleQuantityChange(quantity + 10)}
                        className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold text-xs active:scale-90 transition-all border border-zinc-800"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  {/* Order summary */}
                  <div className="flex justify-between items-center text-xs py-1 border-t border-zinc-900">
                    <span className="text-zinc-500 font-semibold">Estimated Value:</span>
                    <span className="text-white font-extrabold">₹{(stock.price * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 touch-manipulation flex items-center justify-center space-x-1.5 ${
                      tradeType === "BUY"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/10"
                        : "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/10"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                    <span>Place Mock {tradeType} Order</span>
                  </button>
                </div>

                {/* Price Alerts Panel */}
                <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center space-x-1">
                      <Bell className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Set Price Alert</span>
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1.5 leading-normal">
                      Get real-time push/in-app notifications when the price crosses your threshold.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase block">Target Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        placeholder={stock.price.toFixed(2)}
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        className="w-full bg-zinc-950 pl-7 pr-3 py-1.5 font-bold text-xs text-white rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-700"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSetAlert}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-zinc-750 active:scale-95 transition-all touch-manipulation"
                  >
                    Set Alert
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
