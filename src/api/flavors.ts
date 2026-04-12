import type { components } from "@/types/api";

type FlavorSuggestionResponse = components["schemas"]["FlavorSuggestionResponse"];

export async function getFlavors(): Promise<FlavorSuggestionResponse[]> {
  const res = await fetch("/api/flavors");
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? "요청에 실패했습니다.");
  return json.data;
}
