"use client";

import { useQuery } from "@tanstack/react-query";
import { getAlcoholsByCategory, searchAlcohols } from "@/api/alcohols";
import type { components } from "@/types/api";

type AlcoholCategory = NonNullable<
  components["schemas"]["AlcoholResponse"]["category"]
>;

export function useAlcoholsByCategory(category: AlcoholCategory | null) {
  return useQuery({
    queryKey: ["alcohols", "category", category],
    queryFn: () => getAlcoholsByCategory(category!),
    enabled: !!category,
  });
}

export function useAlcoholSearch(keyword: string) {
  return useQuery({
    queryKey: ["alcohols", "search", keyword],
    queryFn: () => searchAlcohols(keyword),
    enabled: keyword.length >= 1,
  });
}
