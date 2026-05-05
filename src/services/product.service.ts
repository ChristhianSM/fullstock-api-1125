import * as categoryRespository from "../repositories/category.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";

export function getProductsByCategory(
  categorySlug: categoryRespository.CategoryRow["slug"],
) {
  return productRepository.getByCategorySlug(categorySlug);
}
