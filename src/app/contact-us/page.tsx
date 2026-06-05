import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | StockWise",
  description: "Get in touch with the StockWise team.",
};

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/50 shrink-0">
              <MessageSquare className="w-6 h-6 text-amber-50" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                Have questions about our data, feedback on our dashboard, or interested in enterprise API access? We'd love to hear from you.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="font-medium">support@stockwise.local</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="font-medium">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>

            <form className="space-y-4 bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/60">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Your Name</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Message</label>
                <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2.5 rounded-xl transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
