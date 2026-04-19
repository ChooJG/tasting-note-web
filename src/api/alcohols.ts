import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];
type AlcoholCategory = NonNullable<AlcoholResponse["category"]>;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = "요청에 실패했습니다.";
    try { message = JSON.parse(text).message ?? message; } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function getAlcoholsByCategory(category: AlcoholCategory): Promise<AlcoholResponse[]> {
  const res = await fetch(`/api/alcohols?category=${category}`);
  return handleResponse(res);
}

export async function searchAlcohols(keyword: string): Promise<AlcoholResponse[]> {
  const res = await fetch(`/api/alcohols?keyword=${encodeURIComponent(keyword)}`);
  return handleResponse(res);
}
