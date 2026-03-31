import { useState } from "react";
import { Send, CheckCircle, Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-[#0f2540] py-14 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-white/40" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Research Digest
              </span>
            </div>
            <h2 className="text-[26px] font-bold text-white leading-tight mb-3">
              Stay Ahead of the Data
            </h2>
            <p className="text-[14px] text-white/55 leading-relaxed max-w-[400px]">
              Get AndaraLab's weekly digest of Indonesia's key economic indicators,
              policy updates, and market-moving insights — delivered every Monday.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {["Weekly Research Digest", "Data Releases", "Policy Alerts"].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 text-[11.5px] text-white/50">
                  <div className="w-1 h-1 rounded-full bg-green-400" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
                <p className="text-[16px] font-semibold text-white mb-1">You're subscribed!</p>
                <p className="text-[13px] text-white/50">First digest arrives Monday.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11.5px] font-semibold text-white/40 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/8 border border-white/15 px-4 py-3 text-[13.5px] text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold text-white/40 uppercase tracking-wide mb-2">
                    Topics (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Macro", "Monetary Policy", "Sectoral", "ESG", "Markets"].map((topic) => (
                      <label key={topic} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="accent-[#1a3a5c]" />
                        <span className="text-[12px] text-white/55">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-[13px] font-semibold text-white bg-[#1a3a5c] border border-[#2a5a8c] px-5 py-2.5 hover:bg-[#234d7a] transition-colors mt-1"
                >
                  <Send className="w-4 h-4" />
                  Subscribe to Digest
                </button>
                <p className="text-[11px] text-white/30">No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
