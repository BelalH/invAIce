"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreatePaymentLinkButton({ proposalId }: { proposalId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Payment link created");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create payment link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full h-8 text-xs gap-1.5"
      onClick={handleCreate}
      disabled={loading}
    >
      {loading ? (
        <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        <CreditCard className="w-3.5 h-3.5" />
      )}
      Create payment link
    </Button>
  );
}
