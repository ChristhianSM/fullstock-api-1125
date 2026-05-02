import camelcaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";
import type { QueryResult } from "pg";
import { isNullOrUndefined } from "../utils/utils.ts";

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

export type  Category = ReturnType <typeof camelcaseKeys<CategoryRow>>

export async function getAll() :Promise<Category[]> {
  const queryResult :QueryResult = await db.query("SELECT * FROM categories");
  const categories :CategoryRow[]  = queryResult.rows; 
  return camelcaseKeys(categories);
}

export async function getById(id:Category["id"]): Promise<Category | null> {
  const queryResult :QueryResult = await db.query("SELECT * FROM categories where id = $1",[id]);
  const category :CategoryRow  = queryResult.rows[0]; 
  return isNullOrUndefined(category) ? null : camelcaseKeys(category);
}

export async function getBySlug(slug:Category["slug"]): Promise<Category | null> {
  const queryResult :QueryResult = await db.query("SELECT * FROM categories where slug = $1",[slug]);
  const category :CategoryRow  = queryResult.rows[0];
  return isNullOrUndefined(category) ? null : camelcaseKeys(category);
}