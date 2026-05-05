"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, ArrowRight, RefreshCw, Save, Send,
  Edit3, CheckCircle2, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Proposal } from "@/types/proposal";
import { DUMMY_PROPOSALS } from "@/lib/dummy/data";

const EXAMPLE_PROMPTS = [
  { label: "Strategy Sprint", prompt: "Proposal for Müller GmbH. 3-month strategy consulting to redesign their go-to-market for the DACH region. Monthly workshops + weekly check-ins. €8,000/month. Starting July 2026. Client: Anna Müller, anna@muller.de" },
  { label: "Monthly Retainer", prompt: "Executive coaching retainer for CEO of a 40-person Amsterdam SaaS company. Bi-weekly 1:1 sessions. €3,200/month. 6-month engagement. Start next month." },
  { label: "Half-day Workshop", prompt: "Product strategy workshop for Nordik Labs. Remote, half-day facilitated session with leadership team. €2,800 flat fee. May 20th." },
];

type GenerationStep = "idle" | "extracting" | "clarifying" | "generating" | "done";

interface ExtractedData {
  client_name: string | null;
  client_email: string | null;
  client_company: string | null;
  title: string;
  engagement_type: string;
  timeline_start: string | null;
  timeline_end: string | null;
  rate_type: "project" | "monthly" | "daily" | "hourly";
  rate_amount: number | null;
  currency: string;
  payment_structure: "one-time" | "milestone" | "retainer";
  deposit_percent: number | null;
  deliverables: { item: string; description: string }[];
  missing_fields: string[];
}

// Simulate AI extraction
async function simulateExtract(prompt: string): Promise<ExtractedData> {
  await new Promise((r) => setTimeout(r, 1800));
  const lower = prompt.toLowerCase();
  const monthlyMatch = prompt.match(/€?([\d,]+)\s*\/?\s*month/i);
  const projectMatch = prompt.match(/€?([\d,]+)\s*(flat|project|total|fee)/i);
  const amount = monthlyMatch ? parseFloat(monthlyMatch[1].replace(",", "")) :
                 projectMatch ? parseFloat(projectMatch[1].replace(",", "")) : null;
  const rateType: "monthly" | "project" | "daily" | "hourly" = monthlyMatch ? "monthly" : "project";

  const emailMatch = prompt.match(/[\w.-]+@[\w.-]+\.\w+/);
  const clientMatch = prompt.match(/for ([A-Z][a-zA-Z\s]+?)[\.,]/);

  return {
    client_name: clientMatch ? clientMatch[1].trim() : null,
    client_email: emailMatch ? emailMatch[0] : null,
    client_company: null,
    title: lower.includes("strategy") ? "Strategic Advisory Engagement" :
           lower.includes("coach") ? "Executive Coaching Programme" :
           lower.includes("workshop") ? "Strategy Workshop" : "Consulting Engagement",
    engagement_type: lower.includes("strategy") ? "Strategy Consulting" :
                     lower.includes("coach") ? "Executive Coaching" :
                     lower.includes("workshop") ? "Workshop" : "Consulting",
    timeline_start: "2026-07-01",
    timeline_end: rateType === "monthly" ? "2026-09-30" : "2026-07-01",
    rate_type: rateType,
    rate_amount: amount,
    currency: "EUR",
    payment_structure: rateType === "monthly" ? "retainer" : "one-time",
    deposit_percent: 50,
    deliverables: [
      { item: "Initial Assessment", description: "Discovery and current state analysis" },
      { item: "Core Deliverable", description: "Main engagement output" },
      { item: "Final Report", description: "Recommendations and next steps" },
    ],
    missing_fields: amount ? [] : ["rate_amount"],
  };
}

// Simulate AI generation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function simulateGenerate(data: ExtractedData, _prompt: string): Promise<Partial<Proposal>> {
  await new Promise((r) => setTimeout(r, 2500));
  const name = data.client_name || "your client";
  const company = data.client_company || name;
  return {
    title: data.title,
    engagement_type: data.engagement_type,
    executive_summary: `${company} stands at a pivotal moment — one that demands clear strategic direction and expert guidance. The challenges ahead are significant, but so is the opportunity.\n\nThis engagement delivers focused, outcome-driven consulting support that moves quickly from diagnosis to execution. Over the coming months, we will work closely together to build the clarity, frameworks, and momentum your organisation needs to move decisively forward.`,
    scope_of_work: `## Deliverables\n\n| Deliverable | Description |\n|------------|-------------|\n| Discovery & Assessment | In-depth analysis of current situation and priorities |\n| Strategic Framework | Core recommendations and decision-making structure |\n| Implementation Support | Hands-on guidance through execution |\n| Final Handover | Documentation and knowledge transfer |\n\n## Timeline\n\n${data.timeline_start} — ${data.timeline_end}\n\n## What's Included\n\n- Regular advisory calls and check-ins\n- All deliverable documentation\n- Async support between sessions\n- Progress reviews and adjustments\n\n## What's Not Included\n\n- Implementation execution beyond advisory scope\n- Additional projects or workstreams not listed`,
    terms_and_conditions: `Payment is due within 14 days of invoice issue. Cancellation requires 14 days written notice; work completed prior to cancellation is billable at a pro-rata rate. All deliverables become client property upon receipt of full payment. Both parties agree to maintain strict confidentiality of all shared information for a period of 2 years. Neither party may assign this agreement without prior written consent.`,
    next_steps: `- Review and confirm this proposal within 7 days\n- Pay the deposit to secure your start date\n- Complete the onboarding questionnaire (sent separately)\n- Schedule kickoff call for the week of ${data.timeline_start}`,
    rate_type: data.rate_type,
    rate_amount: data.rate_amount ?? 5000,
    currency: data.currency,
    payment_structure: data.payment_structure,
    client_name: data.client_name ?? "",
    client_email: data.client_email ?? null,
    client_company: data.client_company ?? null,
    deliverables: data.deliverables,
    timeline_start: data.timeline_start,
    timeline_end: data.timeline_end,
    deposit_percent: data.deposit_percent,
  };
}

export default function NewProposalPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [step, setStep] = useState<GenerationStep>("idle");
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [generated, setGenerated] = useState<Partial<Proposal> | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [clarifyAmount, setClarifyAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please describe your engagement first");
      return;
    }
    setStep("extracting");
    try {
      const data = await simulateExtract(prompt);
      setExtracted(data);
      if (data.missing_fields.length > 0) {
        setStep("clarifying");
      } else {
        await generate(data);
      }
    } catch {
      toast.error("We couldn't extract your proposal details. Please try again.");
      setStep("idle");
    }
  }

  async function generate(data: ExtractedData) {
    setStep("generating");
    try {
      const result = await simulateGenerate(data, prompt);
      setGenerated(result);
      setStep("done");
    } catch {
      toast.error("Generation partially failed — we've pre-filled what we could.");
      setStep("idle");
    }
  }

  async function handleClarify() {
    if (!extracted) return;
    const updated = { ...extracted, rate_amount: parseFloat(clarifyAmount), missing_fields: [] };
    setExtracted(updated);
    await generate(updated);
  }

  function updateGenerated(key: keyof Proposal, value: string) {
    setGenerated((g) => g ? ({ ...g, [key]: value }) : g);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Proposal saved");
    // In real app: persist to DB and get ID back
    router.push(`/proposals/${DUMMY_PROPOSALS[0].id}`);
  }


  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">New Proposal</h1>
        <p className="text-sm text-gray-500 mt-0.5">Describe your engagement — we&apos;ll generate a professional proposal in seconds.</p>
      </div>

      {step === "idle" && (
        <div className="animate-slide-up max-w-2xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe your engagement in plain English. For example:\n\n"Proposal for Müller GmbH. 3-month strategy consulting project to redesign their go-to-market approach for the DACH region. Monthly workshops + weekly check-ins. €8,000/month. Starting July 2026. Client contact is Anna Müller, anna@muller.de"`}
              className="min-h-[160px] resize-none border-0 shadow-none text-sm leading-relaxed focus-visible:ring-0 p-0 text-gray-700 placeholder:text-gray-400"
              rows={6}
            />
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Try an example:</span>
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setPrompt(ex.prompt)}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors font-medium"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="gradient-brand text-white border-0 shadow-sm gap-2 h-9 px-5"
              >
                <Sparkles className="w-4 h-4" />
                Generate Proposal
              </Button>
            </div>
          </div>
        </div>
      )}

      {(step === "extracting" || step === "generating") && (
        <div className="max-w-2xl animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {step === "extracting" ? "Extracting engagement details…" : "Writing your proposal…"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {step === "extracting"
                ? "Identifying client, scope, timeline, and pricing from your description."
                : "Drafting executive summary, scope of work, and terms tailored to your engagement."}
            </p>
            <div className="flex items-center gap-1.5 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "clarifying" && extracted && (
        <div className="max-w-2xl animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-medium text-gray-900">Almost there — just one more detail:</p>
            </div>
            <div className="space-y-4">
              {extracted.missing_fields.includes("rate_amount") && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Engagement fee / rate</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={clarifyAmount}
                      onChange={(e) => setClarifyAmount(e.target.value)}
                      placeholder="e.g. 8000"
                      type="number"
                      className="h-10 w-40"
                    />
                    <span className="text-sm text-gray-500 capitalize">per {extracted.rate_type}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-5">
              <Button
                onClick={handleClarify}
                disabled={!clarifyAmount}
                className="gradient-brand text-white border-0 shadow-sm gap-2"
              >
                Generate Now <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "done" && generated && (
        <div className="animate-fade-in">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Proposal generated</span>
              <span className="text-xs text-gray-400">• Auto-saving every 30s</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Draft
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs gradient-brand text-white border-0 gap-1.5"
                onClick={handleSave}
              >
                <Send className="w-3.5 h-3.5" />
                Generate PDF & Send
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Editor — 60% */}
            <div className="lg:col-span-3 space-y-4">
              {/* Header info */}
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="pt-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Client</p>
                      <p className="text-sm font-semibold text-gray-900">{generated.client_name || "—"}</p>
                      {generated.client_company && (
                        <p className="text-xs text-gray-500">{generated.client_company}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Engagement</p>
                      <p className="text-sm font-semibold text-gray-900">{generated.title}</p>
                      <p className="text-xs text-gray-500">{generated.engagement_type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Rate</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(generated.rate_amount ?? 0, generated.currency ?? "EUR")}
                        <span className="text-xs font-normal text-gray-500 ml-1">/{generated.rate_type}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Timeline</p>
                      <p className="text-sm text-gray-900">
                        {generated.timeline_start} — {generated.timeline_end}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {[
                { key: "executive_summary", label: "Executive Summary" },
                { key: "scope_of_work", label: "Scope of Work" },
                { key: "terms_and_conditions", label: "Terms & Conditions" },
                { key: "next_steps", label: "Next Steps" },
              ].map(({ key, label }) => (
                <ProposalSection
                  key={key}
                  label={label}
                  value={(generated as Record<string, string>)[key] ?? ""}
                  isEditing={editingSection === key}
                  onEdit={() => setEditingSection(editingSection === key ? null : key)}
                  onChange={(v) => updateGenerated(key as keyof Proposal, v)}
                  onRegenerate={async () => {
                    toast.info(`Regenerating ${label}…`);
                    await new Promise((r) => setTimeout(r, 1500));
                    toast.success(`${label} regenerated`);
                  }}
                />
              ))}
            </div>

            {/* Preview — 40% */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <p className="text-xs font-medium text-gray-500 mb-2">Preview</p>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <ProposalPreview proposal={generated} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalSection({
  label, value, isEditing, onEdit, onChange, onRegenerate,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (v: string) => void;
  onRegenerate: () => void;
}) {
  return (
    <Card className={cn(
      "border-gray-100 shadow-sm transition-all",
      isEditing && "ring-2 ring-brand-200 border-brand-200"
    )}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{label}</p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-brand-600"
              onClick={onRegenerate}
              title="Regenerate this section"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-brand-600"
              onClick={onEdit}
              title="Edit this section"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[120px] text-sm text-gray-700 resize-none"
            autoFocus
          />
        ) : (
          <div
            className="prose-proposal cursor-text hover:bg-gray-50/50 rounded-lg p-2 -m-2 transition-colors"
            onClick={onEdit}
          >
            {value.split("\n").map((line, i) => (
              <p key={i} className={cn("text-sm text-gray-700", !line && "h-3")}>
                {line || " "}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProposalPreview({ proposal }: { proposal: Partial<Proposal> }) {
  const total = (proposal.rate_amount ?? 0);
  return (
    <div className="p-5 text-xs space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-gray-100">
        <div>
          <div className="w-16 h-5 rounded bg-brand-100 mb-1" />
          <p className="font-semibold text-gray-900 text-sm">{proposal.title || "Engagement Title"}</p>
          <p className="text-gray-500">Prepared for: {proposal.client_name || "Client Name"}</p>
        </div>
        <div className="text-right text-gray-500">
          <p className="font-mono">PROPOSAL</p>
          <p>{new Date().toLocaleDateString("en-GB")}</p>
        </div>
      </div>

      {/* Summary */}
      {proposal.executive_summary && (
        <div>
          <p className="font-semibold text-brand-700 text-xs uppercase tracking-wide mb-1">Executive Summary</p>
          <p className="text-gray-600 leading-relaxed line-clamp-4">
            {proposal.executive_summary.split("\n")[0]}
          </p>
        </div>
      )}

      {/* Investment */}
      <div>
        <p className="font-semibold text-brand-700 text-xs uppercase tracking-wide mb-2">Investment</p>
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">{proposal.engagement_type || "Consulting"}</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(total, proposal.currency ?? "EUR")}
              <span className="font-normal text-gray-500">/{proposal.rate_type}</span>
            </span>
          </div>
          {proposal.deposit_percent && (
            <div className="flex justify-between text-gray-500">
              <span>Deposit ({proposal.deposit_percent}%)</span>
              <span>{formatCurrency(total * proposal.deposit_percent / 100, proposal.currency ?? "EUR")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pay CTA */}
      <div className="bg-brand-600 rounded-lg p-3 text-center text-white">
        <p className="font-semibold text-sm">Pay online</p>
        <p className="text-brand-200 text-xs mt-0.5">Stripe payment link will appear here</p>
      </div>

      <p className="text-center text-gray-400 text-xs">— Page 1 of 3 —</p>
    </div>
  );
}
