import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "invAIce — AI Proposals & Invoices for Consultants",
  description: "Generate professional proposals and VAT-compliant invoices in seconds. Built for independent consultants and coaches in Europe.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
