"use client";
import React, { useState, useMemo } from "react";
import { StockInfo } from "@/lib/stockCache";
import { TrendingDown, AlertOctagon } from "lucide-react";

export default function WorstPerformerBox({ stocks }: { stocks: StockInfo[] }) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");

  // Use accurate data if available, fallback to stable mock if simulated
  const performanceData = useMemo(() => {
    return stocks.map((stock) => {
      if (stock.weekPerf !== undefined) {
        return stock;
      }
      // Fallback for SIMULATED mode before API fetches
      let hash = 0;
      for (let i = 0; i < stock.symbol.length; i++) {
        hash = stock.symbol.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const seed = Math.abs(hash);
      const daily = stock.changePercent;
      
      const wMod = ((seed % 100) / 100) * 8 + 2;
      const mMod = (((seed >> 2) % 100) / 100) * 25 + 5;
      const yMod = (((seed >> 4) % 100) / 100) * 80 + 30;

      return {
        ...stock,
        weekPerf: daily < 0 ? -wMod : (seed % 2 === 0 ? -wMod : -wMod * 0.5),
        monthPerf: daily < 0 ? -mMod : (seed % 3 === 0 ? -mMod : -mMod * 0.5),
        yearPerf: daily < 0 ? -yMod : (seed % 4 === 0 ? -yMod : -yMod * 0.5),
      };
    });
  }, [stocks]);

  const worstPerformers = useMemo(() => {
    if (performanceData.length === 0) return [];
    return [...performanceData].sort((a, b) => {
      const aW = a.weekPerf ?? 0;
      const bW = b.weekPerf ?? 0;
      const aM = a.monthPerf ?? 0;
      const bM = b.monthPerf ?? 0;
      const aY = a.yearPerf ?? 0;
      const bY = b.yearPerf ?? 0;
      
      if (timeframe === "week") return aW - bW; // Ascending for worst
      if (timeframe === "month") return aM - bM;
      return aY - bY;
    }).slice(0, 10);
  }, [performanceData, timeframe]);

  if (worstPerformers.length === 0) {
    return (
      <div className="h-48 bg-zinc-900/40 border border-zinc-900 rounded-3xl animate-pulse"></div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-900/80 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6 transition-all duration-500">
      {/* Decorative flares */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header with Title and Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-800 flex items-center justify-center shadow-lg shadow-rose-900/50 shrink-0">
            <AlertOctagon className="w-6 h-6 text-rose-50" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Worst Performers</h3>
            <p className="text-rose-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <TrendingDown className="w-3 h-3" /> Heaviest Losses
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/80 flex shadow-inner shrink-0">
          {(["week", "month", "year"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all duration-300 ${
                timeframe === t 
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700/50" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll List */}
      <div className="flex overflow-x-auto space-x-4 pb-2 pt-1 z-10 snap-x custom-scrollbar">
        {worstPerformers.map((stock, index) => {
          const perfValue = timeframe === "week" ? stock.weekPerf : timeframe === "month" ? stock.monthPerf : stock.yearPerf;
          const displayPerf = perfValue ?? 0;
          return (
            <div 
              key={stock.symbol} 
              className="min-w-[200px] max-w-[200px] bg-zinc-950/50 hover:bg-zinc-900 border border-zinc-850 hover:border-rose-500/30 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 snap-start group shrink-0 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-black text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">#{index + 1}</span>
              </div>
              <div>
                <h4 className="text-xl font-black text-white group-hover:text-rose-400 transition-colors tracking-tight">{stock.symbol.split('.')[0]}</h4>
                <p className="text-xs font-medium text-zinc-500 truncate mt-1">{stock.name}</p>
              </div>
              <div className="flex items-baseline gap-1 mt-auto pt-2">
                <span className="text-2xl font-black text-rose-400">{displayPerf > 0 ? "+" : ""}{displayPerf.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Scrollbar hide styles can be added here or in globals.css */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.4); 
          border-radius: 10px;
          margin: 0 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.8); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 82, 91, 1); 
        }
      `}} />
    </div>
  );
}
