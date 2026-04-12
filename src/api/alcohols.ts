import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];
type AlcoholCategory = NonNullable<AlcoholResponse["category"]>;

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "요청에 실패했습니다.");
  return json.data;
}

export async function getAlcoholsByCategory(category: AlcoholCategory): Promise<AlcoholResponse[]> {
  const res = await fetch(`/api/alcohols?category=${category}`);
  return handleResponse(res);
}

export async function searchAlcohols(keyword: string): Promise<AlcoholResponse[]> {
  const res = await fetch(`/api/alcohols?keyword=${encodeURIComponent(keyword)}`);
  return handleResponse(res);
}
