import { Router } from "express";
import { getCategories,getCategoryBySlug } from "./controllers/category.controler.ts";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

router.get("/categories",getCategories);
router.get("/category/:slug",getCategoryBySlug);
export default router;
