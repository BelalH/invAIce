export type InvoiceStatus = "unpaid" | "overdue" | "paid" | "void";

export type VATScenario =
  | "standard"
  | "reverse_charge"
  | "exempt"
  | "outside_scope"
  | "oss";

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  proposal_id: string | null;

  invoice_number: string;

  client_name: string;
  client_email: string | null;
  client_company: string | null;
  client_vat_number: string | null;
  client_country_code: string | null;
  client_address: string | null;

  line_items: LineItem[];

  currency: string;
  subtotal: number;
  vat_rate: number | null;
  vat_amount: number;
  total: number;

  vat_scenario: VATScenario | null;
  vat_notice: string | null;

  issue_date: string;
  due_date: string;
  supply_date: string | null;

  status: InvoiceStatus;

  stripe_payment_link_id: string | null;
  stripe_payment_link_url: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  paid_amount: number;

  pdf_url: string | null;
  pdf_generated_at: string | null;

  created_at: string;
  updated_at: string;
}
