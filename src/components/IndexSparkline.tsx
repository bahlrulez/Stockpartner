"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";

interface IndexSparklineProps {
  history: number[];
  isPositive: boolean;
}

export default function IndexSparkline({ history, isPositive }: IndexSparklineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !history || history.length === 0) {
    return (
      <div className="h-16 w-32 bg-zinc-900/40 rounded-lg animate-pulse" />
    );
  }

  // Format the raw numbers array into Recharts data
  const data = history.map((price, idx) => ({
    x: idx,
    y: price
  }));

  const strokeColor = isPositive ? "#10b981" : "#f43f5e"; // Emerald-500 vs Rose-500
  const glowId = isPositive ? "glowUp" : "glowDown";
  const gradId = isPositive ? "gradUp" : "gradDown";

  // Padding domain slightly to make line fit beautifully
  const prices = history;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const padding = (max - min) * 0.05 || 1;

  return (
    <div className="h-16 w-32 sm:w-40 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            {/* Glow Filter */}
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Area Fill Gradient */}
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          
          <YAxis domain={[min - padding, max + padding]} hide={true} />
          <Area
            type="monotone"
            dataKey="y"
            stroke={strokeColor}
            strokeWidth={1.8}
            filter={`url(#${glowId})`}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
