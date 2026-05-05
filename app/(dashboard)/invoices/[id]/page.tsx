"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { DUMMY_INVOICES, DUMMY_PROFILE } from "@/lib/dummy/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const invoice = DUMMY_INVOICES.find((i) => i.id === id) ?? DUMMY_INVOICES[0];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/invoices")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to invoices
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 font-mono">{invoice.invoice_number}</h1>
            <StatusBadge status={invoice.status} />
            {invoice.vat_scenario && <StatusBadge status={invoice.vat_scenario} />}
          </div>
          <p className="text-sm text-gray-500">
            {invoice.client_company || invoice.client_name}
            {invoice.client_email ? ` · ${invoice.client_email}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => toast.info("PDF generation requires Puppeteer — not available in demo")}
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
          {invoice.status !== "paid" && (
            <Button
              size="sm"
              className="h-8 text-xs gradient-brand text-white border-0 gap-1.5"
              onClick={() => toast.info("Email sending requires Resend — not available in demo")}
            >
              <Send className="w-3.5 h-3.5" />
              Send to client
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice document */}
        <div className="lg:col-span-2 animate-slide-up">
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            {/* Invoice header */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
              <div className="flex justify-between">
                <div>
                  <div className="w-20 h-6 rounded gradient-brand mb-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">INVOICE</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-gray-900">{invoice.invoice_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Issue date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(invoice.issue_date)}</p>
                  <p className="text-xs text-gray-500 mt-2">Due date</p>
                  <p className={`text-sm font-medium ${invoice.status === "overdue" ? "text-red-600" : "text-gray-900"}`}>
                    {formatDate(invoice.due_date)}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Parties */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">From</p>
                  <p className="text-sm font-semibold text-gray-900">{DUMMY_PROFILE.full_name}</p>
                  {DUMMY_PROFILE.company_name && (
                    <p className="text-xs text-gray-600">{DUMMY_PROFILE.company_name}</p>
                  )}
                  {DUMMY_PROFILE.address_line1 && (
                    <p className="text-xs text-gray-500 mt-1">{DUMMY_PROFILE.address_line1}</p>
                  )}
                  {DUMMY_PROFILE.city && (
                    <p className="text-xs text-gray-500">{DUMMY_PROFILE.postal_code} {DUMMY_PROFILE.city}</p>
                  )}
                  {DUMMY_PROFILE.vat_number && (
                    <p className="text-xs text-gray-500 mt-1">VAT: {DUMMY_PROFILE.vat_number}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">To</p>
                  <p className="text-sm font-semibold text-gray-900">{invoice.client_name}</p>
                  {invoice.client_company && (
                    <p className="text-xs text-gray-600">{invoice.client_company}</p>
                  )}
                  {invoice.client_address && (
                    <p className="text-xs text-gray-500 mt-1">{invoice.client_address}</p>
                  )}
                  {invoice.client_vat_number && (
                    <p className="text-xs text-gray-500 mt-1">VAT: {invoice.client_vat_number}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Line items */}
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Description</th>
                      <th className="text-right text-xs font-medium text-gray-500 pb-2">Qty</th>
                      <th className="text-right text-xs font-medium text-gray-500 pb-2">Unit price</th>
                      <th className="text-right text-xs font-medium text-gray-500 pb-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.line_items.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                        <td className="py-2.5 text-sm text-gray-900">{item.description}</td>
                        <td className="py-2.5 text-sm text-gray-700 text-right">{item.quantity}</td>
                        <td className="py-2.5 text-sm text-gray-700 text-right">
                          {formatCurrency(item.unit_price, invoice.currency)}
                        </td>
                        <td className="py-2.5 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.amount, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    VAT {invoice.vat_rate !== null && invoice.vat_rate > 0 ? `(${invoice.vat_rate}%)` : "(0%)"}
                  </span>
                  <span className="text-gray-900">{formatCurrency(invoice.vat_amount, invoice.currency)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(invoice.total, invoice.currency)}</span>
                </div>
              </div>

              {/* VAT notice */}
              {invoice.vat_notice && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <AlertTriangle className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-800">{invoice.vat_notice}</p>
                </div>
              )}

              {/* VAT disclaimer */}
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
                VAT calculations are provided for guidance only. You are responsible for ensuring your invoices comply with the tax rules applicable to your specific circumstances. Consult a qualified tax advisor if in doubt.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 animate-slide-up animate-delay-100">
          {/* Payment */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoice.status === "paid" ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-800">Paid in full</p>
                    <p className="text-xs text-emerald-600">{formatDate(invoice.paid_at)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Outstanding</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(invoice.total, invoice.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Due date</span>
                    <span className={`text-xs font-medium ${invoice.status === "overdue" ? "text-red-600" : "text-gray-900"}`}>
                      {formatDate(invoice.due_date)}
                    </span>
                  </div>
                  {invoice.stripe_payment_link_url ? (
                    <Button
                      asChild
                      size="sm"
                      className="w-full h-8 text-xs gradient-brand text-white border-0 gap-1.5"
                    >
                      <a href={invoice.stripe_payment_link_url} target="_blank">
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Supply info */}
          {invoice.supply_date && (
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="pt-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Supply date</p>
                <p className="text-sm text-gray-900">{formatDate(invoice.supply_date)}</p>
              </CardContent>
            </Card>
          )}

          {/* Linked proposal */}
          {invoice.proposal_id && (
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="pt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Linked proposal</p>
                <Button asChild variant="outline" size="sm" className="w-full h-8 text-xs">
                  <Link href={`/proposals/${invoice.proposal_id}`}>
                    View proposal →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
