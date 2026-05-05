export interface Profile {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  country_code: string;
  vat_number: string | null;
  vat_validated: boolean;
  default_currency: string;
  default_payment_terms: string;
  brand_color: string;
  logo_url: string | null;
  stripe_account_id: string | null;
  stripe_connected_at: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  invoice_prefix: string;
  invoice_counter: number;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}
