import { z } from "zod/v4";

export const noteFormSchema = z.object({
  alcoholId: z.number().nullable().optional(),
  customAlcoholName: z.string().optional(),
  title: z.string().optional(),
  rating: z.number().min(0.5, "평점을 선택해주세요.").max(5),
  taste: z.string().optional(),
  aroma: z.string().optional(),
  pairing: z.string().optional(),
  description: z.string().optional(),
  drankAt: z.string().optional(),
  location: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type NoteFormInput = z.infer<typeof noteFormSchema>;
