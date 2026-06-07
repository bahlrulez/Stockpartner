import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | StockWise",
  description: "Read the StockWise Privacy Policy to understand how we protect your personal information and financial data while using our dashboard.",
  openGraph: {
    title: "Privacy Policy | StockWise",
    description: "Read the StockWise Privacy Policy to understand how we protect your personal information and financial data.",
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-900/50 shrink-0">
              <Shield className="w-6 h-6 text-emerald-50" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
            <p className="text-emerald-400 font-semibold text-xs uppercase tracking-widest">Last updated: June 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
              <p>We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or when you contact us directly regarding your stock tracking preferences.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
              <p>We use personal information collected via our website to provide and manage real-time financial tracking, improve user experience through customized dashboards, and secure your personalized watchlist preferences. We process your data based on legitimate business interests and your direct consent.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Data Security</h2>
              <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
