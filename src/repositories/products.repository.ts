import type { QueryResult } from "pg";
import * as db from "../db/index.ts";
import camelcaseKeys from "camelcase-keys";
export interface ProductRow {
    id:number,
    title:string,
    slug:string,
    img_src:string,
    price:number,
    description:string,
    features:string[],
    category_id:number,
    create_at:Date,
    update_at:Date
} 
export type Product = ReturnType<typeof camelcaseKeys<ProductRow>>;

export const getBySlug = async (slug:ProductRow["slug"]) : Promise<Product[]|null>=>{
const results:QueryResult = await db.query<QueryResult>(
`SELECT p.* FROM Products p 
INNER JOIN Categories c 
ON p.category_id = c.id 
WHERE c.slug = $1`,[slug]);
return camelcaseKeys(results.rows);

}
export const getById = async (id:ProductRow["id"])=>{
const results:QueryResult = await db.query<QueryResult>(
`SELECT * FROM Products Where id = 1$`,[id]);
return camelcaseKeys(results.rows);
}

export const getAll = async ()=>{
const queryResult :QueryResult = await db.query("SELECT * FROM products");
const products :ProductRow[]  = queryResult.rows; 
return camelcaseKeys(products);
}