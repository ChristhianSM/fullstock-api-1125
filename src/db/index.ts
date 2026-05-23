import { Pool, type PoolClient, type QueryResultRow } from "pg";

export const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

export function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
  client?: PoolClient,
) {
  const runner = client ?? pool;
  console.log("Ejecutando la siguiente sentencia: ", text);

  return runner.query<T>(text, params);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
