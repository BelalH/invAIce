"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, CreditCard, CheckCircle2, Unlink, Save } from "lucide-react";
import { DUMMY_PROFILE } from "@/lib/dummy/data";
import { COUNTRY_NAMES } from "@/lib/vat/rates";
import { toast } from "sonner";

const SORTED_COUNTRIES = [
  "DE","FR","NL","GB","ES","IT","BE","SE","PL","CH",
  "AT","DK","FI","NO","PT","IE","CZ","RO","HU","SK",
  "BG","HR","SI","LT","LV","EE","LU","CY","MT","GR",
];

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ ...DUMMY_PROFILE });
  const [branding, setBranding] = useState({
    brand_color: DUMMY_PROFILE.brand_color,
    invoice_prefix: DUMMY_PROFILE.invoice_prefix,
  });

  function updateProfile(key: string, value: string) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Settings saved");
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile, branding, and connected services.</p>
      </div>

      <Tabs defaultValue="profile" className="animate-slide-up">
        <TabsList className="h-9 mb-6">
          <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
          <TabsTrigger value="branding" className="text-xs">Branding</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-0 space-y-4">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">Personal & Business Details</CardTitle>
              <CardDescription className="text-xs">These appear on all proposals and invoices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Full name</Label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => updateProfile("full_name", e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Company name</Label>
                  <Input
                    value={profile.company_name ?? ""}
                    onChange={(e) => updateProfile("company_name", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Country</Label>
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
                  <Input
                    value={profile.vat_number ?? ""}
                    onChange={(e) => updateProfile("vat_number", e.target.value)}
                    className="h-10 font-mono"
                    placeholder="DE123456789"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Street address</Label>
                <Input
                  value={profile.address_line1 ?? ""}
                  onChange={(e) => updateProfile("address_line1", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">City</Label>
                  <Input
                    value={profile.city ?? ""}
                    onChange={(e) => updateProfile("city", e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Postal code</Label>
                  <Input
                    value={profile.postal_code ?? ""}
                    onChange={(e) => updateProfile("postal_code", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Default currency</Label>
                  <Select value={profile.default_currency} onValueChange={(v) => updateProfile("default_currency", v ?? "EUR")}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["EUR", "GBP", "CHF", "SEK", "DKK", "NOK", "PLN"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-600">Payment terms</Label>
                  <Select value={profile.default_payment_terms} onValueChange={(v) => updateProfile("default_payment_terms", v ?? "Net 14")}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Net 7", "Net 14", "Net 30", "Due on receipt"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-brand text-white border-0 h-9 text-sm gap-2"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save changes
            </Button>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="mt-0 space-y-4">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">Brand Identity</CardTitle>
              <CardDescription className="text-xs">Your logo and colours appear on proposals, invoices, and client pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Logo */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-2 block">Logo</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-brand-300 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-brand-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Drop your logo here, or browse</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG · Max 5MB · Recommended: 400×100px</p>
                </div>
              </div>

              {/* Brand colour */}
              <div className="space-y-2">
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
                  />
                </div>
              </div>

              {/* Invoice prefix */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">Invoice prefix</Label>
                <Input
                  value={branding.invoice_prefix}
                  onChange={(e) => setBranding((b) => ({ ...b, invoice_prefix: e.target.value }))}
                  className="h-10 w-40 font-mono"
                />
                <p className="text-xs text-gray-400">
                  Example: <span className="font-mono font-medium">{branding.invoice_prefix}-2026-009</span>
                </p>
              </div>

              <Separator />

              {/* Live preview */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-3 block">Preview</Label>
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: `2px solid ${branding.brand_color}` }}>
                    <div>
                      <div className="w-20 h-5 rounded mb-1" style={{ background: `${branding.brand_color}22` }} />
                      <p className="text-xs font-semibold text-gray-900">{DUMMY_PROFILE.full_name}</p>
                      <p className="text-xs text-gray-500">{DUMMY_PROFILE.company_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: branding.brand_color }}>PROPOSAL</p>
                      <p className="text-xs text-gray-500">{new Date().toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: branding.brand_color }}>EXECUTIVE SUMMARY</p>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-4/5" />
                    <div className="h-2 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gradient-brand text-white border-0 h-9 text-sm gap-2"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save changes
            </Button>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-0 space-y-4">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold">Stripe Connect</CardTitle>
              <CardDescription className="text-xs">
                Accept card payments, SEPA direct debit, iDEAL, and more — directly from your proposals and invoices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {DUMMY_PROFILE.stripe_account_id ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Stripe connected</p>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Account: {DUMMY_PROFILE.stripe_account_id} ·
                        Connected {new Date(DUMMY_PROFILE.stripe_connected_at!).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Active payment methods</p>
                    {["Credit & debit cards", "SEPA Direct Debit", "SOFORT"].map((m) => (
                      <div key={m} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-brand-100 flex items-center justify-center">
                          <span className="text-brand-600 text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-700">{m}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => toast.info("Stripe disconnect not available in demo")}
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    Disconnect Stripe
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Connect your Stripe account to embed live payment links in every proposal and invoice.
                      Your clients pay directly — funds go straight to your account.
                    </p>
                  </div>
                  <Button
                    className="gradient-brand text-white border-0 shadow-sm gap-2"
                    onClick={() => toast.info("Stripe Connect not configured in demo mode")}
                  >
                    <CreditCard className="w-4 h-4" />
                    Connect with Stripe
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
