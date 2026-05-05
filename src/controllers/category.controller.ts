import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import type { CategoryRow } from "../repositories/category.repository.ts";
import * as categoryService from "../services/category.service.ts";

export async function getCategories(_req: Request, res: Response) {
  const categories = await categoryService.getCategories();
  res.status(200).json({ status: "success", data: categories });
}

export interface SlugParams {
  slug: CategoryRow["slug"];
}

// Crear una funcion llamada getCategory, que recibe del request, el slug
export async function getCategory(req: Request<SlugParams>, res: Response) {
  const { slug } = req.params;
  const category = await categoryService.getCategory(slug);
  if (!category) {
    throw new ApiError(404, "Categoria no encontrada");
  }

  res.json({ status: "success", data: category });
}
