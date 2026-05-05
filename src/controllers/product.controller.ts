import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import * as categoryService from "../services/category.service.ts";
import * as productService from "../services/product.service.ts";
import * as categoryController from "./category.controller.ts";

export async function getProductsByCategory(
  req: Request<categoryController.SlugParams>,
  res: Response,
) {
  const { slug } = req.params;
  const category = await categoryService.getCategory(slug);

  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  const products = await productService.getProductsByCategory(slug);

  res.json({ status: "success", data: products });
}
