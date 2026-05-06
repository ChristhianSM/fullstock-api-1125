import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as productRepository from "../repositories/product.repository.ts";
import * as categoryService from "../services/category.service.ts";
import * as productService from "../services/product.service.ts";
import * as categoryController from "./category.controller.ts";

export interface Filters {
  minPrice?: number;
  maxPrice?: number;
}

export async function getProductsByCategory(
  req: Request<
    categoryController.SlugParams,
    unknown,
    unknown,
    { minPrice?: string; maxPrice?: string }
  >,
  res: Response,
) {
  const { slug } = req.params;
  const { minPrice, maxPrice } = req.query;
  const filters: Filters = {};

  if (minPrice !== undefined) filters.minPrice = Number(minPrice);

  if (maxPrice !== undefined) filters.maxPrice = Number(maxPrice);

  const category = await categoryService.getCategory(slug);

  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  const products = await productService.getProductsByCategory(slug, filters);

  res.json({ status: "success", data: products });
}

export interface ProductSlugParams {
  slug: productRepository.ProductSlug;
}

export async function getProduct(
  req: Request<ProductSlugParams>,
  res: Response,
): Promise<void> {
  const { slug } = req.params;
  const product = await productService.getProduct(slug);
  if (!product) {
    throw new ApiError(404, "El producto no existe");
  }
  res.json({ status: "success", data: product });
}
