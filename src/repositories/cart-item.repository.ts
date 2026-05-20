import camelCaseKeys from "camelcase-keys";
import * as db from "../db/index.ts";

interface CartItemRow {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

interface ItemsWithProductsRow extends CartItemRow {
  title: string;
  slug: string;
  img_src: string;
  price: number;
}

export type CartItem = ReturnType<typeof camelCaseKeys<CartItemRow>>;
export type ItemsWithProducts = ReturnType<
  typeof camelCaseKeys<ItemsWithProductsRow>
>;

export async function create(
  productId: number,
  cartId: number,
  quantity: number,
): Promise<CartItem> {
  const result = await db.query<CartItemRow>(
    ` INSERT INTO cart_items(cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *`,
    [cartId, productId, quantity],
  );

  const row = result.rows[0];

  if (row === undefined) throw new Error("Insercion no devolvio una fila");

  return camelCaseKeys(row);
}

export async function findByCartAndProduct(
  productId: number,
  cartId: number,
): Promise<CartItem | null> {
  const result = await db.query<CartItemRow>(
    `
    SELECT * FROM cart_items
    WHERE cart_id = $1 AND product_id = $2;`,
    [cartId, productId],
  );

  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}

export async function findById(id: number): Promise<CartItem | null> {
  const result = await db.query<CartItemRow>(
    `
    SELECT * FROM cart_items
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] !== undefined ? camelCaseKeys(result.rows[0]) : null;
}

export async function updateQuantity(id: number, quantity: number) {
  const result = await db.query<CartItemRow>(
    `
    UPDATE cart_items SET quantity = $1, update_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [quantity, id],
  );

  const row = result.rows[0];

  if (row === undefined) throw new Error("Actualizacion no devolvio una fila");

  return camelCaseKeys(row);
}

export async function remove(id: number): Promise<void> {
  await db.query("DELETE FROM cart_items WHERE id = $1", [id]);
}

export async function getItemsWithProductsByCartId(
  cartId: number,
): Promise<ItemsWithProducts[]> {
  const result = await db.query<ItemsWithProductsRow>(
    `
    SELECT ci.*, p.title,p.slug, p.img_src, p.price  FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE cart_id = $1
    `,
    [cartId],
  );

  return camelCaseKeys(result.rows);
}
