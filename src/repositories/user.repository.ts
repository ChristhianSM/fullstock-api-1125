import camelCaseKey from "camelcase-keys";
import * as db from "../db/index.ts";

interface UserRow {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export type User = ReturnType<typeof camelCaseKey<UserRow>>;
export type PublicUser = Omit<User, "password">;

export async function create(email: string, password: string): Promise<User> {
  const result = await db.query<UserRow>(
    `
      INSERT INTO users(email, password)
      VALUES ($1, $2)
      RETURNING *
    `,
    [email, password],
  );

  const row = result.rows[0];

  if (row === undefined)
    throw new Error("Ocurrio un problema en la insercion del usuario");

  return camelCaseKey(row);
}

export async function findByEmail(email: string): Promise<User | null> {
  const result = await db.query<UserRow>(
    `
      SELECT * FROM users
      WHERE email = $1
    `,
    [email],
  );

  const row = result.rows[0];

  return row !== undefined ? camelCaseKey(row) : null;
}
