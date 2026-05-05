import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft:    { label: "Draft",     className: "bg-gray-100 text-gray-700 border-gray-200" },
  sent:     { label: "Sent",      className: "bg-blue-50 text-blue-700 border-blue-200" },
  viewed:   { label: "Viewed",    className: "bg-purple-50 text-purple-700 border-purple-200" },
  signed:   { label: "Signed",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  declined: { label: "Declined",  className: "bg-red-50 text-red-700 border-red-200" },
  expired:  { label: "Expired",   className: "bg-orange-50 text-orange-700 border-orange-200" },
  unpaid:   { label: "Unpaid",    className: "bg-amber-50 text-amber-700 border-amber-200" },
  overdue:  { label: "Overdue",   className: "bg-red-50 text-red-700 border-red-200" },
  paid:     { label: "Paid",      className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  void:     { label: "Void",      className: "bg-gray-100 text-gray-500 border-gray-200" },
  standard:         { label: "Standard VAT",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reverse_charge:   { label: "Reverse Charge",  className: "bg-blue-50 text-blue-700 border-blue-200" },
  outside_scope:    { label: "Outside Scope",   className: "bg-gray-100 text-gray-700 border-gray-200" },
  exempt:           { label: "VAT Exempt",      className: "bg-gray-100 text-gray-500 border-gray-200" },
  oss:              { label: "OSS",             className: "bg-violet-50 text-violet-700 border-violet-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-700 border-gray-200" };
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium px-2 py-0.5 rounded-md", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
