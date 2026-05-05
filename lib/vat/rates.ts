export const VAT_RATES: Record<string, number> = {
  AT: 20, BE: 21, BG: 20, CY: 19, CZ: 21, DE: 19, DK: 25,
  EE: 22, ES: 21, FI: 25.5, FR: 20, GR: 24, HR: 25, HU: 27,
  IE: 23, IT: 22, LT: 21, LU: 17, LV: 21, MT: 18, NL: 21,
  PL: 23, PT: 23, RO: 19, SE: 25, SI: 22, SK: 20,
  GB: 20, CH: 8.1, NO: 25,
};

export const EU_COUNTRIES = new Set([
  "AT","BE","BG","CY","CZ","DE","DK","EE","ES","FI","FR","GR","HR",
  "HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK",
]);

export const COUNTRY_NAMES: Record<string, string> = {
  DE: "Germany", FR: "France", NL: "Netherlands", GB: "United Kingdom",
  ES: "Spain", IT: "Italy", BE: "Belgium", SE: "Sweden", PL: "Poland",
  CH: "Switzerland", AT: "Austria", DK: "Denmark", FI: "Finland", NO: "Norway",
  PT: "Portugal", IE: "Ireland", CZ: "Czech Republic", RO: "Romania",
  HU: "Hungary", SK: "Slovakia", BG: "Bulgaria", HR: "Croatia", SI: "Slovenia",
  LT: "Lithuania", LV: "Latvia", EE: "Estonia", LU: "Luxembourg", CY: "Cyprus",
  MT: "Malta", GR: "Greece",
};
