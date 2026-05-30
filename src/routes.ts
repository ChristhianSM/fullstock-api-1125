import { Router } from "express";
import * as cartItemController from "./controllers/cart-item.controller.ts";
import * as cartController from "./controllers/cart.controller.ts";
import * as categoryController from "./controllers/category.controller.ts";
import * as orderController from "./controllers/order.controller.ts";
import * as productController from "./controllers/product.controller.ts";
import * as sessionController from "./controllers/session.controller.ts";
import * as userController from "./controllers/user.controller.ts";

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

// Obtener el carrito completo
router.get("/cart", cartController.getCart);

// Crear una orden
router.post("/order", orderController.createOrder);

// Crear usuario
router.post("/users", userController.createUser);

// Obtener la session activa del usuario.
router.get("/users/me", userController.getCurrentUser);

// Crear session - Login
router.post("/sessions", sessionController.createSession);

// Eliminar la session - Logout
router.delete("/sessions", sessionController.deleteSession);

export default router;
