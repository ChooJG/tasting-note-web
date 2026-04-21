"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getAlcoholsByCategory, searchAlcohols } from "@/api/alcohols";
import type { components } from "@/types/api";

type AlcoholCategory = NonNullable<
  components["schemas"]["AlcoholResponse"]["category"]
>;

export function useAlcoholsByCategory(category: AlcoholCategory | null) {
  return useInfiniteQuery({
    queryKey: ["alcohols", "category", category],
    queryFn: ({ pageParam }) => getAlcoholsByCategory(category!, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!category,
  });
}

export function useAlcoholSearch(keyword: string) {
  return useInfiniteQuery({
    queryKey: ["alcohols", "search", keyword],
    queryFn: ({ pageParam }) => searchAlcohols(keyword, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: keyword.length >= 1,
  });
}
