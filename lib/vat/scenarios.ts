import type { VATScenario } from "@/types/invoice";
import { VAT_RATES, EU_COUNTRIES } from "./rates";

interface VATResult {
  scenario: VATScenario;
  vatRate: number;
  notice: string | null;
}

export function determineVATScenario(
  consultantCountry: string,
  consultantVATNumber: string | null,
  clientCountry: string | null,
  clientVATNumber: string | null,
  consultantVATExempt: boolean
): VATResult {
  if (consultantVATExempt || !consultantVATNumber) {
    return { scenario: "exempt", vatRate: 0, notice: "VAT exempt supply" };
  }

  if (!clientCountry || clientCountry === consultantCountry) {
    const rate = VAT_RATES[consultantCountry] ?? 0;
    return { scenario: "standard", vatRate: rate, notice: null };
  }

  const clientIsEU = EU_COUNTRIES.has(clientCountry);
  const consultantIsEU = EU_COUNTRIES.has(consultantCountry);

  if (!clientIsEU) {
    return { scenario: "outside_scope", vatRate: 0, notice: "Supply outside scope of VAT" };
  }

  if (clientIsEU && consultantIsEU && clientVATNumber) {
    return {
      scenario: "reverse_charge",
      vatRate: 0,
      notice: "Reverse charge — VAT to be accounted for by the recipient",
    };
  }

  // B2C cross-border EU — OSS
  const rate = VAT_RATES[clientCountry] ?? 0;
  return {
    scenario: "oss",
    vatRate: rate,
    notice: `VAT charged at rate applicable in country of supply (${clientCountry}: ${rate}%)`,
  };
}
