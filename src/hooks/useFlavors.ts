"use client";

import { useQuery } from "@tanstack/react-query";
import { getFlavors } from "@/api/flavors";

export function useFlavors() {
  return useQuery({
    queryKey: ["flavors"],
    queryFn: getFlavors,
    staleTime: 5 * 60 * 1000,
  });
}
