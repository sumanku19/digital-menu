export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "China",
  "South Africa"
  // Add more or load using a library if needed
];

export function isValidCountry(country: string): boolean {
  return COUNTRIES.includes(country);
}
