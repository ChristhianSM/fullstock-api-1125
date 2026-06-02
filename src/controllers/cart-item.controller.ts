import type { Request, Response } from "express";
import { requireCart } from "../guards/cart.guard.ts";
import {
  createCartItemBodySchema,
  updateCartItemBodySchema,
} from "../schemas/cart-item.schema.ts";
import { idParamsSchema } from "../schemas/params.schema.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import * as cartService from "../services/cart.service.ts";

export async function createCartItem(req: Request, res: Response) {
  const { productId, quantity } = createCartItemBodySchema.parse(req.body);

  let cart;

  if (req.session.cartId !== undefined) {
    cart = await requireCart(req);
  } else {
    cart = await cartService.createCart(req.session.userId);
    req.session.cartId = cart.id;
  }

  // Crear un cart-item
  const item = await cartItemService.createCartItem(
    productId,
    cart.id,
    quantity,
  );

  res.status(201).json({ status: "success", data: item });
}

export async function updateCartItem(req: Request, res: Response) {
  const cart = await requireCart(req);

  const { id } = idParamsSchema.parse(req.params);
  const { quantity } = updateCartItemBodySchema.parse(req.body);

  const item = await cartItemService.updateCartItemQuantity(
    cart.id,
    id,
    quantity,
  );

  res.status(200).json({ status: "success", data: item });
}

export async function deleteCartItem(req: Request, res: Response) {
  const cart = await requireCart(req);

  const { id } = idParamsSchema.parse(req.params);

  await cartItemService.deleteCartItem(cart.id, id);
  res.status(204).send();
}
