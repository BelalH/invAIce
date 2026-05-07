"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowRight, Globe, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const FEATURES = [
  "AI-generated proposals in under 60 seconds",
  "VAT-compliant invoices for all EU27 + UK + CH",
  "Embedded Stripe payment links",
  "Beautiful client-facing proposal pages",
];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return "At least 8 characters";
    if (!/[0-9]/.test(pw)) return "Must include a number";
    if (!/[^A-Za-z0-9]/.test(pw)) return "Must include a special character";
    return null;
  }

  const passwordError = password ? validatePassword(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validatePassword(password);
    if (err) {
      toast.error(err);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm your account");
    router.push("/login");
  }

  async function handleGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        {/* Left — value prop */}
        <div className="hidden md:flex flex-col justify-center py-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">invAIce</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4 text-balance">
            Win more engagements.<br />Get paid faster.
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The proposal and invoice tool built specifically for independent consultants and coaches in Europe.
          </p>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div>
          <div className="flex items-center gap-2 justify-center md:hidden mb-8">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">invAIce</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
              <p className="text-sm text-gray-500 mt-1">Free to start — no credit card required</p>
            </div>

            <Button
              variant="outline"
              className="w-full mb-4 h-10 text-sm font-medium gap-2"
              onClick={handleGoogle}
            >
              <Globe className="w-4 h-4" />
              Continue with Google
            </Button>

            <div className="relative mb-4">
              <Separator />
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">or</span>
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-gray-600">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Müller"
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-gray-600">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-gray-600">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars, number & symbol"
                  required
                  className={`h-10 ${passwordError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                />
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-10 gap-2 gradient-brand text-white border-0 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline">Terms</Link> and{" "}
                <Link href="#" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
