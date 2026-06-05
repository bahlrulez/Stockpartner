"use client";

import React from "react";
import { Activity } from "lucide-react";

interface ApiStatusProps {
  status: "LIVE" | "RATE_LIMITED" | "SIMULATED" | string;
}

export default function ApiStatus({ status }: ApiStatusProps) {
  const isLive = status === "LIVE";
  
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all duration-300 ${
      isLive 
        ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/30" 
        : "bg-amber-950/60 text-amber-400 border-amber-800/30"
    }`}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          isLive ? "bg-emerald-400" : "bg-amber-400"
        }`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          isLive ? "bg-emerald-500" : "bg-amber-500"
        }`}></span>
      </span>
      <span className="flex items-center gap-1">
        <Activity className="w-3.5 h-3.5" />
        <span>{isLive ? "Yahoo Finance: Live" : "Simulated Feed (API Limited)"}</span>
      </span>
    </div>
  );
}
