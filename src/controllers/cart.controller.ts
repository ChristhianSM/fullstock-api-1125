import type { Request, Response } from "express";
import { requireCart } from "../guards/cart.guard.ts";

export async function getCart(req: Request, res: Response) {
  const cart = await requireCart(req, true);

  res.status(200).json({ status: "success", data: cart });
}
