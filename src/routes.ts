import { Router } from "express";
import { getCategories } from "./controllers/category.controler.ts";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

router.get("/categories",getCategories);
export default router;
