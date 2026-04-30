import app from "./app.ts";
// import * as db from "./db/index.ts";
import * as db from "./db/index.ts";

const PORT = process.env["PORT"] ?? 3000;

try {
  await db.query("SELECT 1");
} catch (error) {
  console.error("Ocurrio un problema con la conexion:", error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log("El servidor corriendo en el puerto: ", PORT);
});
