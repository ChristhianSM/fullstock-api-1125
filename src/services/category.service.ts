import * as categoryRepository from "../repositories/category.repository.ts";
import type { Category } from "../repositories/category.repository.ts";

export async function getCategories(): Promise<Category[]> {
  return categoryRepository.getAll();
}

// Crear una funcion que se llamara getCategory(slug) y conecta con el repository
export async function getCategory(
  slug: categoryRepository.CategoryRow["slug"],
): Promise<Category | null> {
  return categoryRepository.finBySlug(slug);
}
