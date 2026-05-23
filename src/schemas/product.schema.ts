import * as z from "zod";

export const getProductsQuerySchema = z.object({
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export type GetProductQuery = z.infer<typeof getProductsQuerySchema>;

// "2000" a 2000
