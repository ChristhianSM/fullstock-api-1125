import type { Request, Response } from "express";
import * as categoryService from "../services/category.service.ts";

export async function getCategories(_req: Request, res: Response) {
  const categories = await categoryService.getCategories();
  res.status(200).json({ status: "success", data: categories });
}
