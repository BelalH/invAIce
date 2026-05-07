import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export const CURRENCY_TO_STRIPE: Record<string, string> = {
  EUR: "eur",
  GBP: "gbp",
  CHF: "chf",
  SEK: "sek",
  DKK: "dkk",
  NOK: "nok",
  PLN: "pln",
};
