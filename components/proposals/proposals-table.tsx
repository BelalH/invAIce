"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Search, Filter, Eye, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Proposal } from "@/types/proposal";

export function ProposalsTable({ proposals }: { proposals: Proposal[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = proposals.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.client_name.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
          <p className="text-sm text-gray-500 mt-0.5">{proposals.length} total engagement{proposals.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm gap-2 h-9">
          <Link href="/proposals/new">
            <PlusCircle className="w-4 h-4" />
            New Proposal
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 animate-slide-up">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search by client or title…"
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up animate-delay-100">
        {proposals.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">No proposals yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Create your first proposal to get started</p>
            <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-1.5">
              <Link href="/proposals/new">
                <PlusCircle className="w-3.5 h-3.5" />
                New Proposal
              </Link>
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-gray-600">No proposals match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or status filter</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Client</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Engagement</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Amount</th>
                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">Sent</th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.client_name}</p>
                      {p.client_company && (
                        <p className="text-xs text-gray-400">{p.client_company}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-700 truncate max-w-xs">{p.title}</p>
                    {p.engagement_type && (
                      <p className="text-xs text-gray-400">{p.engagement_type}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(p.rate_amount, p.currency)}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">/{p.rate_type}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-gray-500">
                      {p.sent_at ? formatDate(p.sent_at) : "—"}
                    </p>
                    {p.open_count > 0 && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Eye className="w-3 h-3" /> {p.open_count}×
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Link href={`/proposals/${p.id}`} title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Link href={`/p/${p.public_token}`} target="_blank" title="Preview client view">
                          <Send className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
