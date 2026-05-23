import * as z from "zod";

export const slugParamsSchema = z.object({
  slug: z.string().min(4),
});

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
