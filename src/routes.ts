import { Router } from "express";
import * as cartItemController from "./controllers/cart-item.controller.ts";
import * as categoryController from "./controllers/category.controller.ts";
import * as productController from "./controllers/product.controller.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

// Obtener todas las categorias
router.get("/categories", categoryController.getCategories);

// Otra ruta para obtener una categoria especifica
router.get("/categories/:slug", categoryController.getCategory);

// Obtener Productos de una categoria
router.get(
  "/categories/:slug/products",
  productController.getProductsByCategory,
);

// Obtener detalle de un producto.
router.get("/products/:slug", productController.getProduct);

// Agregar un producto al carrito
router.post("/cart/items", cartItemController.createCartItem);

// Actualizar cantidad de un item del carrito
router.patch("/cart/items/:id", cartItemController.updateCartItem);

// Eliminar un item del carrito
router.delete("/cart/items/:id", cartItemController.deleteCartItem);

export default router;
