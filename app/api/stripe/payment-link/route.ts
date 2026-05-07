import { NextResponse } from "next/server";
import { stripe, CURRENCY_TO_STRIPE } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getProposalById, updateProposal } from "@/lib/supabase/proposals";

export async function POST(request: Request) {
  try {
    const { proposalId } = await request.json();
    if (!proposalId) return NextResponse.json({ error: "proposalId required" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const proposal = await getProposalById(supabase, proposalId);
    if (!proposal || proposal.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const currency = CURRENCY_TO_STRIPE[proposal.currency] ?? "eur";
    const amountInCents = Math.round(proposal.rate_amount * 100);
    const label = proposal.deposit_percent
      ? `Deposit (${proposal.deposit_percent}%) — ${proposal.title}`
      : proposal.title;
    const depositAmount = proposal.deposit_percent
      ? Math.round((proposal.rate_amount * proposal.deposit_percent) / 100)
      : proposal.rate_amount;
    const depositInCents = Math.round(depositAmount * 100);

    // Create Stripe product + price + payment link
    const product = await stripe.products.create({
      name: label,
      metadata: { proposal_id: proposalId, user_id: user.id },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: depositInCents,
      currency,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: "redirect",
        redirect: { url: `${siteUrl}/p/${proposal.public_token}?paid=true` },
      },
      metadata: { proposal_id: proposalId },
    });

    // Save back to proposal
    await updateProposal(supabase, proposalId, {
      stripe_payment_link_id: paymentLink.id,
      stripe_payment_link_url: paymentLink.url,
    });

    return NextResponse.json({ url: paymentLink.url });
  } catch (err) {
    console.error("Stripe payment link error:", err);
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 500 });
  }
}
