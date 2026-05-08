import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";

interface CartRow {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export type Cart = ReturnType<typeof camelCaseKeys<CartRow>>;

export async function create(): Promise<Cart> {
  const result = await db.query<CartRow>(
    "INSERT INTO carts DEFAULT VALUES RETURNING *",
  );
  if (result.rows[0] === undefined)
    throw new Error("Insercion no devolvio una fila");

  return camelCaseKeys(result.rows[0]);
}

export async function findById(id: number): Promise<Cart | null> {
  const result = await db.query<CartRow>(
    `SELECT * FROM carts
    WHERE id = $1`,
    [id],
  );
  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}

export async function touch(id: number): Promise<void> {
  // Completa el cuerpo de la función.
  await db.query(
    `
      UPDATE carts
      SET update_at = NOW() 
      WHERE id = $1`,
    [id],
  );
}
