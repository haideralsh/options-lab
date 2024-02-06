import { LoaderFunction } from "@remix-run/node";

export interface SymbolDetails {
  description: string;
  exchange: string;
  symbol: string;
  type: string; // @todo: Narrow down
}

export interface SearchResponse {
  symbols: SymbolDetails[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const q = new URL(request.url).searchParams.get("q");
  if (!q) return [];

  try {
    const response = await fetch(`https://options-lab.vercel.app/api/symbols?q=${q}`);
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
};
