import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];
type AlcoholCategory = NonNullable<AlcoholResponse["category"]>;

export type PagedAlcoholResponse = {
  content: AlcoholResponse[];
  hasNext: boolean;
  nextCursor?: string;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = "요청에 실패했습니다.";
    try { message = JSON.parse(text).message ?? message; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function getAlcoholsByCategory(category: AlcoholCategory, cursor?: string): Promise<PagedAlcoholResponse> {
  const params = new URLSearchParams({ category });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`/api/alcohols?${params}`);
  return handleResponse(res);
}

export async function searchAlcohols(keyword: string, cursor?: string, category?: AlcoholCategory): Promise<PagedAlcoholResponse> {
  const params = new URLSearchParams({ keyword });
  if (cursor) params.set("cursor", cursor);
  const res = await fetch(`/api/alcohols?${params}`);
  const data = await handleResponse<PagedAlcoholResponse>(res);
  if (category) {
    return { ...data, content: data.content.filter((a) => a.category === category) };
  }
  return data;
}
