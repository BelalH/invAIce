import Link from "next/link";
import {
  FileText, Sparkles, CreditCard,
  ArrowRight, Shield, Globe, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-generated in 60 seconds",
    description: "Describe your engagement in plain English. Our AI extracts every detail and writes a polished, professional proposal — scope, deliverables, timeline, T&Cs, all included.",
  },
  {
    icon: Shield,
    title: "VAT-compliant invoices",
    description: "Automatically applies the correct VAT scenario: standard, reverse charge, outside scope, or OSS — for all EU27 + UK + CH + Norway. With the legal notice text included.",
  },
  {
    icon: CreditCard,
    title: "Stripe payments embedded",
    description: "Every proposal and invoice includes a live Stripe payment link. Your clients pay directly from the proposal — no chasing, no bank details, no friction.",
  },
  {
    icon: Globe,
    title: "Beautiful client pages",
    description: "Proposals live at a shareable link, branded with your logo and colours. Clients see a clean, professional page — not a PDF attachment.",
  },
];

const STEPS = [
  { num: "1", label: "Describe the engagement", desc: "Write a few sentences about your client, scope, timeline, and rate." },
  { num: "2", label: "Review the AI draft", desc: "Claude writes the executive summary, scope of work, T&Cs, and next steps. Edit any section inline." },
  { num: "3", label: "Send and get paid", desc: "Share the proposal link with your client. They read, pay the deposit, and you're confirmed." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">invAIce</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Sign in</Link>
            <Button asChild size="sm" className="gradient-brand text-white border-0 shadow-sm h-8 text-xs px-4">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Background */}
        <div className="absolute inset-0 gradient-subtle" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-100/40 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium mb-6 animate-fade-in">
            <Zap className="w-3 h-3" />
            AI-powered · VAT-compliant · Stripe-ready
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 text-balance animate-slide-up">
            Win engagements.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Get paid faster.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up animate-delay-100">
            The proposal and invoice tool built for independent consultants and coaches in Europe.
            AI-generated, VAT-compliant, client-ready in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up animate-delay-200">
            <Button
              asChild
              className="gradient-brand text-white border-0 shadow-lg h-11 px-7 text-sm font-semibold gap-2 w-full sm:w-auto"
            >
              <Link href="/signup">
                Generate your first proposal <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 px-7 text-sm font-medium w-full sm:w-auto"
            >
              <Link href={`/p/abc123def456ghi789jkl012`}>
                See a live example →
              </Link>
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-4">Free to start · No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Everything a solo consultant needs
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            No bloat. No team features. No CRM. Just the tools you need to win work and get paid.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <f.icon className="w-4.5 h-4.5 text-brand-600 w-[18px] h-[18px]" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              From idea to signed proposal in 3 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                  <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center mx-auto mb-4 text-white font-bold text-base shadow-md">
                    {s.num}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 z-10 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / persona */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-brand-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-balance">
            Built for €500–€20,000 engagements
          </h2>
          <p className="text-brand-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Strategy consultants, executive coaches, fractional executives, and specialist advisors
            across Germany, France, the Netherlands, the UK, and beyond.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {["Strategy Consulting", "Executive Coaching", "Fractional CFO/CMO/CTO", "Leadership Development", "Product Advisory", "Change Management"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/20">
                {tag}
              </span>
            ))}
          </div>
          <Button
            asChild
            className="bg-white text-brand-700 font-semibold h-11 px-8 text-sm shadow-lg hover:bg-brand-50 gap-2"
          >
            <Link href="/signup">
              Start generating proposals <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">invAIce</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 invAIce. Built for independent consultants in Europe.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600">Terms</Link>
            <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
