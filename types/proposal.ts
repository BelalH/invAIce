export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "declined"
  | "expired";

export interface Deliverable {
  item: string;
  description: string;
}

export interface PaymentScheduleItem {
  label: string;
  amount: number;
  due_date: string;
}

export interface Proposal {
  id: string;
  user_id: string;

  client_name: string;
  client_email: string | null;
  client_company: string | null;
  client_vat_number: string | null;
  client_country_code: string | null;
  client_address: string | null;

  title: string;
  engagement_type: string | null;
  scope_summary: string | null;
  deliverables: Deliverable[];
  timeline_start: string | null;
  timeline_end: string | null;
  timeline_notes: string | null;

  currency: string;
  rate_type: "project" | "monthly" | "daily" | "hourly";
  rate_amount: number;
  payment_structure: "one-time" | "milestone" | "retainer";
  payment_schedule: PaymentScheduleItem[];
  deposit_percent: number | null;

  executive_summary: string | null;
  scope_of_work: string | null;
  terms_and_conditions: string | null;
  next_steps: string | null;

  original_prompt: string | null;

  status: ProposalStatus;
  public_token: string;

  stripe_payment_link_id: string | null;
  stripe_payment_link_url: string | null;
  stripe_payment_intent_id: string | null;
  amount_paid: number;

  pdf_url: string | null;
  pdf_generated_at: string | null;

  sent_at: string | null;
  first_opened_at: string | null;
  open_count: number;
  signed_at: string | null;
  declined_at: string | null;
  expires_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface ProposalEvent {
  id: string;
  proposal_id: string;
  event_type: "opened" | "payment_started" | "payment_completed";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
