import type { components } from "@/types/api";

type FlavorSuggestionResponse = components["schemas"]["FlavorSuggestionResponse"];

export async function getFlavors(): Promise<FlavorSuggestionResponse[]> {
  const res = await fetch("/api/flavors");
  if (!res.ok) throw new Error("맛/향 목록을 불러오는데 실패했습니다.");
  return res.json();
}
