import { Client } from "pg";
const connectionString :string  = process.env["DATABASE_URL"] || "error";
console.log(connectionString);
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "1234",
  database: "practice",
});
const client2 = new Client({
  connectionString
});
export const testGetCategories = async ()=>{

// Abre la conexión
await client2.connect();
 
const result = await client2.query("SELECT * FROM categories");
 
console.log(result.rows); // Array de objetos, uno por fila
console.log(result.rowCount); // Número de filas devueltas o afectadas
 
// Cierra la conexión
await client2.end();
}
