import * as categoryRespository from "../repositories/category.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";

export function getProductsByCategory(
  categorySlug: categoryRespository.CategoryRow["slug"],
) {
  return productRepository.getByCategorySlug(categorySlug);
}

export async function getProduct(
  slug: productRepository.ProductSlug,
): Promise<productRepository.Product | null> {
  return productRepository.findBySlug(slug);
}
