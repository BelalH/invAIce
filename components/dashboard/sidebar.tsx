"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Settings,
  LogOut,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DUMMY_PROFILE } from "@/lib/dummy/data";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/proposals", icon: FileText, label: "Proposals" },
  { href: "/invoices", icon: Receipt, label: "Invoices" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-60 h-screen flex flex-col bg-white border-r border-gray-100 shrink-0 sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900 tracking-tight">invAIce</span>
        </Link>
      </div>

      {/* New proposal CTA */}
      <div className="px-3 pt-4 pb-2">
        <Button
          asChild
          className="w-full h-9 gradient-brand text-white border-0 shadow-sm text-xs font-medium gap-1.5"
        >
          <Link href="/proposals/new">
            <PlusCircle className="w-3.5 h-3.5" />
            New Proposal
          </Link>
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-600")} />
              {label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="gradient-brand text-white text-xs font-semibold">
              {initials(DUMMY_PROFILE.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">{DUMMY_PROFILE.full_name}</p>
            <p className="text-xs text-gray-400 truncate">{DUMMY_PROFILE.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={() => router.push("/login")}
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-400" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
