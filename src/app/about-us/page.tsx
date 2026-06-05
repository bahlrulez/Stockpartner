import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | StockWise",
  description: "Learn more about the team behind StockWise.",
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-900/50 shrink-0">
              <Users className="w-6 h-6 text-indigo-50" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">About Us</h1>
          </div>

          <div className="space-y-6 text-zinc-300 leading-relaxed text-sm md:text-base">
            <p className="text-xl font-medium text-white leading-snug">
              Democratizing market insights for everyone.
            </p>
            <p>
              StockWise was born out of a simple idea: the stock market shouldn't feel like a walled garden. 
              We are a dedicated team of engineers, data scientists, and finance enthusiasts committed to building the 
              most seamless, real-time, and beautiful financial dashboard for the Indian stock market.
            </p>
            <p>
              By leveraging the power of modern web technologies like Next.js, Edge networking, and rapid API aggregation, 
              we bring Wall Street-grade analytics directly to your browser—completely free from clutter and complex jargon.
            </p>
            
            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
              <p>To empower retail investors with lightning-fast data, intuitive interfaces, and uncompromising reliability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
