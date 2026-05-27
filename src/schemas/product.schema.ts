import * as z from "zod";

export const getProductsQuerySchema = z.object({
  minPrice: z.optional(z.coerce.number().positive()).catch(undefined),
  maxPrice: z.optional(z.coerce.number().positive()).catch(undefined),
});

export type GetProductQuery = z.infer<typeof getProductsQuerySchema>;

// "2000" a 2000
