"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyLinkButton({ publicUrl }: { publicUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Client link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={copy}>
      <Copy className="w-3.5 h-3.5" />
      {copied ? "Copied!" : "Copy link"}
    </Button>
  );
}
