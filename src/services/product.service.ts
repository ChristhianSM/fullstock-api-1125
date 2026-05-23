import * as productController from "../controllers/product.controller.ts";
import * as categoryRespository from "../repositories/category.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";

export function getProductsByCategory(
  categorySlug: categoryRespository.CategoryRow["slug"],
  filters: productController.Filters,
) {
  return productRepository.getByCategorySlug(categorySlug, filters);
}

export async function getProduct(
  slug: productRepository.ProductSlug,
): Promise<productRepository.Product | null> {
  return productRepository.findBySlug(slug);
}

export async function getProductById(
  id: number,
): Promise<productRepository.Product | null> {
  return productRepository.getById(id);
}
