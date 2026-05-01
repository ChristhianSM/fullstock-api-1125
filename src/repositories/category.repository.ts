import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";

export interface CategoryRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  alt: string | null;
  description: string;
  create_at: Date;
  update_at: Date;
}

export type Category = ReturnType<typeof camelCaseKeys<CategoryRow>>;

export async function getAll(): Promise<Category[]> {
  const result = await db.query<CategoryRow>("SELECT * FROM categories");
  return camelCaseKeys(result.rows);
}

export async function finBySlug(slug: CategoryRow["slug"]) {
  const result = await db.query<CategoryRow>(
    `SELECT * FROM categories WHERE slug = $1`,
    [slug],
  );

  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}
