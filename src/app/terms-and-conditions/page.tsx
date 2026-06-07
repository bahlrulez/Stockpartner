import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | StockWise",
  description: "Review the Terms and Conditions for using StockWise, covering user responsibilities, limitations of simulated trading data, and usage guidelines.",
  openGraph: {
    title: "Terms & Conditions | StockWise",
    description: "Review the Terms and Conditions for using StockWise.",
    url: "/terms-and-conditions",
  },
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-800 flex items-center justify-center shadow-lg shadow-rose-900/50 shrink-0">
              <FileText className="w-6 h-6 text-rose-50" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Terms & Conditions</h1>
          </div>

          <div className="space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
            <p className="text-rose-400 font-semibold text-xs uppercase tracking-widest">Effective Date: June 2026</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
              <p>By accessing our website, you agree to be bound by these Terms of Use and to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Informational Purposes Only</h2>
              <p>All data and information provided on this site is for informational purposes only. StockWise makes no representations as to accuracy, completeness, currentness, suitability, or validity of any financial data on this site. <strong>We are not registered financial advisors.</strong></p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Investment Risk</h2>
              <p>Trading in financial markets involves a high degree of risk. Past performance is not indicative of future results. You are solely responsible for your own investment decisions. We accept no liability for any loss or damage arising directly or indirectly from your use of this data.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
