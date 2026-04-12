import { z } from "zod/v4";

export const noteFormSchema = z.object({
  alcoholId: z.number().min(1, "술을 선택해주세요."),
  title: z.string().optional(),
  rating: z.number().min(1, "평점을 선택해주세요.").max(5),
  tasteIds: z.array(z.number()).min(1, "맛을 하나 이상 선택해주세요."),
  aromaIds: z.array(z.number()).min(1, "향을 하나 이상 선택해주세요."),
  pairing: z.string().optional(),
  description: z.string().optional(),
  drankAt: z.string().optional(),
  location: z.string().optional(),
});

export type NoteFormInput = z.infer<typeof noteFormSchema>;
