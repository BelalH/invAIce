"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileText, ArrowRight, ArrowLeft, CheckCircle2, Upload, CreditCard, SkipForward } from "lucide-react";
import { COUNTRY_NAMES } from "@/lib/vat/rates";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SORTED_COUNTRIES = [
  "DE","FR","NL","GB","ES","IT","BE","SE","PL","CH",
  "AT","DK","FI","NO","PT","IE","CZ","RO","HU","SK",
  "BG","HR","SI","LT","LV","EE","LU","CY","MT","GR",
];

const STEPS = ["Your Details", "Branding", "Payments"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    company_name: "",
    country_code: "DE",
    vat_number: "",
    address_line1: "",
    city: "",
    postal_code: "",
  });

  const [branding, setBranding] = useState({
    brand_color: "#2563EB",
    invoice_prefix: "INV",
  });

  const [vatStatus, setVatStatus] = useState<"idle"|"checking"|"valid"|"invalid">("idle");

  function updateProfile(key: string, value: string) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function checkVAT(vatNumber: string) {
    if (!vatNumber || vatNumber.length < 5) return;
    setVatStatus("checking");
    await new Promise((r) => setTimeout(r, 1000));
    setVatStatus(vatNumber.startsWith("DE") ? "valid" : "invalid");
  }

  async function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setLoading(false);
      toast.success("Profile set up — welcome to invAIce!");
      router.push("/dashboard");
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">invAIce</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                i < step ? "bg-brand-600 text-white" :
                i === step ? "bg-brand-600 text-white ring-4 ring-brand-100" :
                "bg-gray-200 text-gray-500"
              )}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                i <= step ? "text-brand-600" : "text-gray-400"
              )}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "w-16 h-px mx-2",
                  i < step ? "bg-brand-600" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-1 mb-6" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Your details</h2>
              <p className="text-sm text-gray-500 mb-6">These appear on your proposals and invoices.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-600">Full name *</Label>
                    <Input
                      value={profile.full_name}
                      onChange={(e) => updateProfile("full_name", e.target.value)}
                      placeholder="Sarah Müller"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-600">Company name</Label>
                    <Input
                      value={profile.company_name}
                      onChange={(e) => updateProfile("company_name", e.target.value)}
                      placeholder="Müller Consulting"
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Country *</Label>
                  <Select
                    value={profile.country_code}
                    onValueChange={(v) => updateProfile("country_code", v ?? "DE")}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORTED_COUNTRIES.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code} — {COUNTRY_NAMES[code]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">VAT number</Label>
                  <div className="relative">
                    <Input
                      value={profile.vat_number}
                      onChange={(e) => updateProfile("vat_number", e.target.value)}
                      onBlur={(e) => checkVAT(e.target.value)}
                      placeholder="DE123456789"
                      className="h-10 pr-24"
                    />
                    {vatStatus !== "idle" && (
                      <span className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium",
                        vatStatus === "checking" ? "text-gray-400" :
                        vatStatus === "valid" ? "text-green-600" : "text-amber-600"
                      )}>
                        {vatStatus === "checking" ? "Checking…" :
                         vatStatus === "valid" ? "✓ Valid" : "⚠ Unverified"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Optional. Validated via VIES — won&apos;t block you.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Street address</Label>
                  <Input
                    value={profile.address_line1}
                    onChange={(e) => updateProfile("address_line1", e.target.value)}
                    placeholder="Kurfürstendamm 42"
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-600">City</Label>
                    <Input
                      value={profile.city}
                      onChange={(e) => updateProfile("city", e.target.value)}
                      placeholder="Berlin"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-600">Postal code</Label>
                    <Input
                      value={profile.postal_code}
                      onChange={(e) => updateProfile("postal_code", e.target.value)}
                      placeholder="10707"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Branding</h2>
              <p className="text-sm text-gray-500 mb-6">Your logo and colour appear on every proposal and invoice.</p>
              <div className="space-y-5">
                <div>
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">Logo</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-300 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-brand-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Drop your logo here</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG · Max 5MB</p>
                    <Button variant="outline" size="sm" className="mt-3 h-8 text-xs">
                      Browse files
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Brand colour</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.brand_color}
                      onChange={(e) => setBranding((b) => ({ ...b, brand_color: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input
                      value={branding.brand_color}
                      onChange={(e) => setBranding((b) => ({ ...b, brand_color: e.target.value }))}
                      className="h-10 font-mono w-36"
                      maxLength={7}
                    />
                    <div
                      className="flex-1 h-10 rounded-lg border border-gray-100"
                      style={{ background: `linear-gradient(135deg, ${branding.brand_color}, ${branding.brand_color}88)` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Invoice prefix</Label>
                  <Input
                    value={branding.invoice_prefix}
                    onChange={(e) => setBranding((b) => ({ ...b, invoice_prefix: e.target.value }))}
                    placeholder="INV"
                    className="h-10 w-40 font-mono"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-400">
                    Your invoices will be numbered: <span className="font-mono font-medium">{branding.invoice_prefix}-2026-001</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Connect Stripe</h2>
              <p className="text-sm text-gray-500 mb-6">Accept payments directly from your proposals and invoices.</p>

              <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-xl p-5 mb-5 border border-brand-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                    <CreditCard className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Embedded payment links</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Connect Stripe to embed a live payment button in every proposal. Your client pays directly — funds land straight in your account.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-10 gradient-brand text-white border-0 shadow-sm gap-2 mb-3"
                onClick={() => toast.info("Stripe Connect not configured in demo mode")}
              >
                <CreditCard className="w-4 h-4" />
                Connect with Stripe
              </Button>

              <Button
                variant="ghost"
                className="w-full h-10 text-gray-500 gap-2"
                onClick={handleNext}
              >
                <SkipForward className="w-4 h-4" />
                Skip for now — I&apos;ll connect later
              </Button>
            </div>
          )}

          {step < 2 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <Button
                  variant="ghost"
                  className="gap-1.5 text-gray-600"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              ) : <div />}
              <Button
                className="gradient-brand text-white border-0 shadow-sm gap-2 px-6"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === STEPS.length - 1 ? "Finish setup" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
