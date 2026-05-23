import camelCaseKeys from "camelcase-keys";
import * as productController from "../controllers/product.controller.ts";
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

export type ProductSlug = ProductRow["slug"];

export async function getByCategorySlug(
  categorySlug: categoryRepository.CategoryRow["slug"],
  filters: productController.Filters,
) {
  const { minPrice, maxPrice } = filters;

  // Contruimos la consulta dinamica
  const params: (string | number)[] = [categorySlug];
  const conditions: string[] = ["c.slug = $1"];

  if (minPrice) {
    params.push(minPrice); //[categorySlug, minPrice]
    conditions.push(`p.price >= $${params.length}`); //["c.slug = $1", "p.price >= $2"]
  }

  if (maxPrice) {
    params.push(maxPrice); // [categorySlug, minPrice, maxPrice]
    conditions.push(`p.price <= $${params.length}`); // ["c.slug = $1", "p.price >= $2"]
  }

  const result = await db.query<ProductRow>(
    `SELECT p.* FROM products p 
    INNER JOIN categories c ON p.category_id = c.id
    WHERE ${conditions.join(" AND ")}`, // ["c.slug = $1", "p.price >= $2", "p.price <= $3"]
    params,
  );

  return camelCaseKeys(result.rows);
}

export async function findBySlug(slug: ProductSlug): Promise<Product | null> {
  const result = await db.query<ProductRow>(
    `
    SELECT * FROM products WHERE slug = $1
    `,
    [slug],
  );
  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}

export async function getById(id: number): Promise<Product | null> {
  const result = await db.query<ProductRow>(
    `
    SELECT * FROM products
    WHERE id = $1
    `,
    [id],
  );

  const row = result.rows[0];

  return row !== undefined ? camelCaseKeys(row) : null;
}
