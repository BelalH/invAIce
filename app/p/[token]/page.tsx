"use client";

import { use, useState } from "react";
import { Download, CreditCard, CheckCircle2, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DUMMY_PROPOSALS, DUMMY_PROFILE } from "@/lib/dummy/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PublicProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const proposal = DUMMY_PROPOSALS.find((p) => p.public_token === token) ?? DUMMY_PROPOSALS[0];
  const [showTerms, setShowTerms] = useState(false);

  const paid = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("paid") === "true";

  const totalValue = proposal.rate_type === "monthly"
    ? proposal.rate_amount * (proposal.payment_schedule?.length || 3)
    : proposal.rate_amount;

  const depositAmount = proposal.deposit_percent
    ? totalValue * proposal.deposit_percent / 100
    : totalValue;

  const brandColor = DUMMY_PROFILE.brand_color;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Paid banner */}
      {paid && (
        <div className="bg-emerald-600 text-white text-sm font-medium text-center py-3 animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Payment received — {DUMMY_PROFILE.full_name} will be in touch shortly.
        </div>
      )}

      {/* Sticky header */}
      <header className="sticky top-0 z-10 glass border-b border-white/50 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Proposal from</p>
            <p className="text-sm font-semibold text-gray-900">{DUMMY_PROFILE.full_name}</p>
          </div>
          <Button
            className="h-9 text-sm gap-2 text-white border-0 shadow-sm"
            style={{ background: brandColor }}
            onClick={() => {
              if (proposal.stripe_payment_link_url) {
                window.open(proposal.stripe_payment_link_url, "_blank");
              } else {
                toast.info("Payment link not yet configured");
              }
            }}
          >
            <CreditCard className="w-4 h-4" />
            {proposal.deposit_percent ? `Pay deposit` : "Pay now"}
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Cover */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
          {/* Brand stripe */}
          <div className="h-2 w-full" style={{ background: brandColor }} />
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${brandColor}15` }}>
                  <Building2 className="w-5 h-5" style={{ color: brandColor }} />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prepared by</p>
                <p className="text-base font-bold text-gray-900">{DUMMY_PROFILE.full_name}</p>
                {DUMMY_PROFILE.company_name && (
                  <p className="text-sm text-gray-600">{DUMMY_PROFILE.company_name}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Proposal</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(proposal.created_at)}</p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-balance">
              {proposal.title}
            </h1>
            <p className="text-base text-gray-600">
              Prepared for: <span className="font-semibold text-gray-900">{proposal.client_name}</span>
              {proposal.client_company ? `, ${proposal.client_company}` : ""}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        {proposal.executive_summary && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-slide-up">
            <SectionHeading label="Executive Summary" color={brandColor} />
            <div className="space-y-3 mt-4">
              {proposal.executive_summary.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm sm:text-base text-gray-700 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables */}
        {proposal.deliverables && proposal.deliverables.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-slide-up animate-delay-100">
            <SectionHeading label="What's Included" color={brandColor} />
            <div className="grid gap-3 mt-4 sm:grid-cols-2">
              {proposal.deliverables.map((d, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${brandColor}20` }}
                  >
                    <span className="text-xs font-bold" style={{ color: brandColor }}>{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{d.item}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {(proposal.timeline_start || proposal.timeline_end) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-slide-up animate-delay-200">
            <SectionHeading label="Timeline" color={brandColor} />
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Start</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(proposal.timeline_start)}</p>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex-1 p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">End</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(proposal.timeline_end)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Investment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-slide-up animate-delay-300">
          <SectionHeading label="Investment" color={brandColor} />
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{proposal.engagement_type || "Consulting"}</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(proposal.rate_amount, proposal.currency)}
                <span className="text-xs font-normal text-gray-500 ml-1">/{proposal.rate_type}</span>
              </span>
            </div>
            {proposal.payment_schedule && proposal.payment_schedule.length > 0 && (
              proposal.payment_schedule.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 pl-4 border-l-2 border-gray-100">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-xs font-medium text-gray-900">
                    {formatCurrency(item.amount, proposal.currency)} · Due {formatDate(item.due_date)}
                  </span>
                </div>
              ))
            )}
            <Separator />
            <div className="flex items-center justify-between py-1">
              <span className="text-base font-bold text-gray-900">Total value</span>
              <span className="text-base font-bold text-gray-900">{formatCurrency(totalValue, proposal.currency)}</span>
            </div>
          </div>

          {/* Payment CTA */}
          <div
            className="mt-5 rounded-xl p-5 text-white"
            style={{ background: brandColor }}
          >
            <p className="text-sm font-semibold mb-1">
              {proposal.deposit_percent
                ? `Pay your deposit (${proposal.deposit_percent}% = ${formatCurrency(depositAmount, proposal.currency)})`
                : "Pay online"}
            </p>
            <p className="text-xs opacity-80 mb-3">
              Secure payment via Stripe. Accepted: card, SEPA debit, iDEAL, Bancontact, SOFORT.
            </p>
            <Button
              className="bg-white text-sm gap-2 font-semibold w-full sm:w-auto"
              style={{ color: brandColor }}
              onClick={() => {
                if (proposal.stripe_payment_link_url) {
                  window.location.href = proposal.stripe_payment_link_url;
                } else {
                  toast.info("Payment link not yet configured");
                }
              }}
            >
              <CreditCard className="w-4 h-4" />
              {proposal.deposit_percent
                ? `Pay ${formatCurrency(depositAmount, proposal.currency)} deposit`
                : `Pay ${formatCurrency(totalValue, proposal.currency)}`}
            </Button>
          </div>
        </div>

        {/* Scope of work (collapsed on mobile) */}
        {proposal.scope_of_work && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-6 sm:p-8">
              <SectionHeading label="Scope of Work" color={brandColor} />
              <div className="mt-4 prose-proposal">
                {proposal.scope_of_work.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i}>{line.replace("## ", "")}</h2>;
                  if (line.startsWith("- ")) return <p key={i} className="text-sm text-gray-700">• {line.slice(2)}</p>;
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return <p key={i} className="text-sm text-gray-700">{line}</p>;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        {proposal.terms_and_conditions && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-slide-up">
            <button
              className="w-full flex items-center justify-between p-6 text-left"
              onClick={() => setShowTerms((s) => !s)}
            >
              <SectionHeading label="Terms & Conditions" color={brandColor} noMargin />
              {showTerms ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {showTerms && (
              <div className="px-6 pb-6">
                <p className="text-sm text-gray-600 leading-relaxed">{proposal.terms_and_conditions}</p>
              </div>
            )}
          </div>
        )}

        {/* Next steps */}
        {proposal.next_steps && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-slide-up">
            <SectionHeading label="Next Steps" color={brandColor} />
            <div className="mt-4 space-y-2">
              {proposal.next_steps.split("\n").filter(Boolean).map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white"
                    style={{ background: brandColor }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step.replace(/^[-•]\s*/, "")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download */}
        <div className="flex justify-center pb-8">
          <Button
            variant="outline"
            className="gap-2 text-sm h-10"
            onClick={() => toast.info("PDF generation requires Puppeteer — not available in demo")}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-6">
          <p>{DUMMY_PROFILE.full_name} · {DUMMY_PROFILE.company_name}</p>
          {DUMMY_PROFILE.address_line1 && (
            <p>{DUMMY_PROFILE.address_line1}, {DUMMY_PROFILE.postal_code} {DUMMY_PROFILE.city}</p>
          )}
          {DUMMY_PROFILE.vat_number && <p>VAT: {DUMMY_PROFILE.vat_number}</p>}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ label, color, noMargin }: { label: string; color: string; noMargin?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", !noMargin && "")}>
      <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
      <p className="text-sm font-bold uppercase tracking-wide" style={{ color }}>{label}</p>
    </div>
  );
}
