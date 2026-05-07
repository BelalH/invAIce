import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, TrendingUp, Clock, FileText, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { getProposals } from "@/lib/supabase/proposals";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const proposals = await getProposals(supabase, user.id);

  const openProposals = proposals.filter(
    (p) => p.status === "sent" || p.status === "viewed"
  ).length;

  const recentProposals = proposals.slice(0, 5);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm gap-2 h-9">
          <Link href="/proposals/new">
            <PlusCircle className="w-4 h-4" />
            New Proposal
          </Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: "Revenue This Month",
            value: formatCurrency(0),
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            delay: "animate-delay-100",
          },
          {
            title: "Outstanding",
            value: formatCurrency(0),
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            delay: "animate-delay-200",
          },
          {
            title: "Open Proposals",
            value: openProposals.toString(),
            icon: FileText,
            color: "text-brand-600",
            bg: "bg-brand-50",
            delay: "animate-delay-300",
          },
        ].map(({ title, value, icon: Icon, color, bg, delay }) => (
          <Card key={title} className={`border-gray-100 shadow-sm animate-slide-up ${delay}`}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500">{title}</p>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <div className="animate-slide-up animate-delay-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recent Proposals</h2>
            <Link href="/proposals" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            {recentProposals.length === 0 ? (
              <CardContent className="py-12 text-center">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">No proposals yet</p>
                <p className="text-xs text-gray-400 mb-4">Describe your first engagement and we&apos;ll have a proposal ready in 60 seconds.</p>
                <Button asChild size="sm" className="gradient-brand text-white border-0 h-8 text-xs">
                  <Link href="/proposals/new">Generate your first proposal</Link>
                </Button>
              </CardContent>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentProposals.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/proposals/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg gradient-subtle flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-brand-700">
                        {p.client_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.client_company || p.client_name}</p>
                      <p className="text-xs text-gray-400 truncate">{p.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(p.rate_amount * (p.rate_type === "monthly" ? 3 : 1))}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Invoices */}
        <div className="animate-slide-up animate-delay-300">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Recent Invoices</h2>
            <Link href="/invoices" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardContent className="py-12 text-center">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600 mb-1">No invoices yet</p>
              <p className="text-xs text-gray-400">Invoices will appear here once you convert a signed proposal.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
