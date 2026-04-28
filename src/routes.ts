import camelCaseKeys from "camelcase-keys";
import { Router } from "express";
import { query } from "./db/index.ts";

const router = Router();

interface CategoryRow {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  alt: string | null;
  description: string;
  create_at: Date;
  update_at: Date;
}

export type Category = ReturnType<typeof camelCaseKeys<CategoryRow>>;

router.get("/", (_req, res) => {
  res.json({ message: "Fulltock Api" });
});

router.get("/categories", async (_req, res) => {
  const result = await query<CategoryRow>("SELECT * FROM categories");
  const categories: Category[] = camelCaseKeys(result.rows);
  res.json(categories);
});

export default router;
