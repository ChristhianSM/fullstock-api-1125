import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { slugParamsSchema } from "../schemas/params.schema.ts";
import { getProductsQuerySchema } from "../schemas/product.schema.ts";
import * as categoryService from "../services/category.service.ts";
import * as productService from "../services/product.service.ts";

export interface Filters {
  minPrice?: number;
  maxPrice?: number;
}

export async function getProductsByCategory(req: Request, res: Response) {
  const { slug } = slugParamsSchema.parse(req.params);
  const { minPrice, maxPrice } = getProductsQuerySchema.parse(req.query);
  console.log({ minPrice, maxPrice });

  const filters: Filters = {};

  if (minPrice !== undefined) filters.minPrice = minPrice;

  if (maxPrice !== undefined) filters.maxPrice = maxPrice;

  const category = await categoryService.getCategory(slug);

  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  const products = await productService.getProductsByCategory(slug, filters);

  res.json({ status: "success", data: products });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { slug } = slugParamsSchema.parse(req.params);
  const product = await productService.getProduct(slug);
  if (!product) {
    throw new ApiError(404, "El producto no existe");
  }
  res.json({ status: "success", data: product });
}
