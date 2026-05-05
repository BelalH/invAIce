"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { DUMMY_INVOICES } from "@/lib/dummy/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = DUMMY_INVOICES.filter((inv) => {
    const matchesSearch =
      search === "" ||
      inv.client_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client_company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">{DUMMY_INVOICES.length} invoices total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 animate-slide-up">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search invoices…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up animate-delay-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Invoice #</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Client</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Subtotal</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">VAT</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Total</th>
              <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">Due</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((inv, i) => (
              <tr
                key={inv.id}
                className="hover:bg-gray-50/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-mono font-medium text-gray-700">{inv.invoice_number}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{inv.client_company || inv.client_name}</p>
                  {inv.client_company && (
                    <p className="text-xs text-gray-400">{inv.client_name}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <p className="text-sm text-gray-700">{formatCurrency(inv.subtotal, inv.currency)}</p>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <p className="text-sm text-gray-700">{formatCurrency(inv.vat_amount, inv.currency)}</p>
                  {inv.vat_rate !== null && inv.vat_rate > 0 && (
                    <p className="text-xs text-gray-400">{inv.vat_rate}%</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(inv.total, inv.currency)}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-xs text-gray-500">{formatDate(inv.due_date)}</p>
                  {inv.paid_at && (
                    <p className="text-xs text-emerald-600">Paid {formatDate(inv.paid_at)}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Link href={`/invoices/${inv.id}`} title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    {inv.status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="Mark as paid"
                        onClick={() => toast.success(`${inv.invoice_number} marked as paid`)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="Download PDF"
                      onClick={() => toast.info("PDF generation requires Puppeteer — not available in demo")}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
