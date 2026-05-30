import camelCaseKeys from "camelcase-keys";
import { type PoolClient } from "pg";
import * as db from "../db/index.ts";

interface CartRow {
  id: number;
  user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export type Cart = ReturnType<typeof camelCaseKeys<CartRow>>;

export async function create(userId?: number): Promise<Cart> {
  const result = await db.query<CartRow>(
    "INSERT INTO carts(user_id) values ($1) RETURNING *",
    [userId ?? null],
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

export async function findByUserId(userId: number): Promise<Cart | null> {
  const result = await db.query<CartRow>(
    "SELECT * FROM carts WHERE user_id = $1",
    [userId],
  );

  const row = result.rows[0];

  return row !== undefined ? camelCaseKeys(row) : null;
}

export async function touch(id: number): Promise<void> {
  await db.query("UPDATE carts SET update_at = NOW() WHERE id = $1", [id]);
}

export async function remove(id: number, client?: PoolClient): Promise<void> {
  await db.query("DELETE FROM carts WHERE id = $1", [id], client);
}

export async function linkToUser(
  cartId: number,
  userId: number,
): Promise<void> {
  await db.query("UPDATE carts SET user_id = $1 WHERE id = $2", [
    userId,
    cartId,
  ]);
}
