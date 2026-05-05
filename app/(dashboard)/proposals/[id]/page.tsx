"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Eye, ExternalLink, Copy, Calendar, Clock, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { DUMMY_PROPOSALS, DUMMY_INVOICES } from "@/lib/dummy/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const proposal = DUMMY_PROPOSALS.find((p) => p.id === id) ?? DUMMY_PROPOSALS[0];
  const invoice = DUMMY_INVOICES.find((i) => i.proposal_id === id);
  const [copying, setCopying] = useState(false);

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/p/${proposal.public_token}`;

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopying(true);
    toast.success("Client link copied");
    setTimeout(() => setCopying(false), 2000);
  }

  const totalValue = proposal.rate_type === "monthly"
    ? proposal.rate_amount * (proposal.payment_schedule?.length || 3)
    : proposal.rate_amount;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/proposals")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" /> Back to proposals
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{proposal.title}</h1>
            <StatusBadge status={proposal.status} />
          </div>
          <p className="text-sm text-gray-500">
            {proposal.client_company ? `${proposal.client_company} · ` : ""}
            {proposal.client_name}
            {proposal.client_email ? ` · ${proposal.client_email}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={copyLink}
          >
            <Copy className="w-3.5 h-3.5" />
            {copying ? "Copied!" : "Copy link"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs gap-1.5"
          >
            <Link href={`/p/${proposal.public_token}`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5" />
              Preview
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs gradient-brand text-white border-0 gap-1.5"
            onClick={() => toast.info("PDF generation requires Puppeteer — not available in demo")}
          >
            <Send className="w-3.5 h-3.5" />
            Send to client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 animate-slide-up">

          {/* Overview */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposal.executive_summary && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Executive Summary</p>
                  <div className="space-y-2">
                    {proposal.executive_summary.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {proposal.deliverables && proposal.deliverables.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Deliverables</p>
                  <div className="space-y-2">
                    {proposal.deliverables.map((d, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.item}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {proposal.next_steps && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Next Steps</p>
                    <div className="space-y-1">
                      {proposal.next_steps.split("\n").filter(Boolean).map((step, i) => (
                        <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-brand-400 mt-0.5">•</span>
                          {step.replace(/^[-•]\s*/, "")}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Terms */}
          {proposal.terms_and_conditions && (
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 leading-relaxed">{proposal.terms_and_conditions}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 animate-slide-up animate-delay-100">
          {/* Pricing */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Investment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Rate</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(proposal.rate_amount, proposal.currency)}
                  <span className="text-xs font-normal text-gray-500 ml-1">/{proposal.rate_type}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total value</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(totalValue, proposal.currency)}</span>
              </div>
              {proposal.deposit_percent && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Deposit ({proposal.deposit_percent}%)</span>
                  <span className="text-sm text-gray-700">{formatCurrency(totalValue * proposal.deposit_percent / 100, proposal.currency)}</span>
                </div>
              )}
              <Separator />
              {proposal.stripe_payment_link_url ? (
                <Button
                  asChild
                  size="sm"
                  className="w-full h-8 text-xs gradient-brand text-white border-0 gap-1.5"
                >
                  <a href={proposal.stripe_payment_link_url} target="_blank">
                    <CreditCard className="w-3.5 h-3.5" /> Pay online
                  </a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs gap-1.5"
                  onClick={() => toast.info("Connect Stripe to generate payment links")}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Create payment link
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Start</p>
                  <p className="text-sm text-gray-900">{formatDate(proposal.timeline_start)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">End</p>
                  <p className="text-sm text-gray-900">{formatDate(proposal.timeline_end)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { icon: FileText, label: "Created", value: formatDate(proposal.created_at) },
                { icon: Send, label: "Sent", value: formatDate(proposal.sent_at) },
                { icon: Eye, label: "First opened", value: formatDate(proposal.first_opened_at) },
                { icon: Clock, label: "Open count", value: proposal.open_count > 0 ? `${proposal.open_count} times` : "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs text-gray-900">{value}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Linked invoice */}
          {invoice && (
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900">Linked Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-xs font-mono font-medium text-gray-700">{invoice.invoice_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(invoice.total, invoice.currency)}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
