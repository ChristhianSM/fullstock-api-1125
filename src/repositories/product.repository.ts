import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import * as categoryRepository from "./category.repository.ts";

export interface ProductRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  price: number;
  description: string;
  features: string[];
  category_id: number;
  create_at: Date;
  update_at: Date;
}

export type Product = ReturnType<typeof camelCaseKeys<ProductRow>>;

export async function getByCategorySlug(
  categorySlug: categoryRepository.CategoryRow["slug"],
) {
  const result = await db.query<ProductRow>(
    `SELECT p.* FROM products p 
    INNER JOIN categories c ON p.category_id = c.id
    WHERE c.slug = $1`,
    [categorySlug],
  );

  console.log(result);

  return camelCaseKeys(result.rows);
}
