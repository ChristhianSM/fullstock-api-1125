import { Router } from "express";
import * as categoryController from "./controllers/category.controller.ts";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

router.get("/categories", categoryController.getCategories);

// Otra ruta para obtener una categoria especifica
router.get("/categories/:slug", categoryController.getCategory);

export default router;
