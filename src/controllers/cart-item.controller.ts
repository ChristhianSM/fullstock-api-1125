import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import {
  createCartItemBodySchema,
  updateCartItemBodySchema,
} from "../schemas/cart-item.schema.ts";
import { idParamsSchema } from "../schemas/params.schema.ts";
import * as cartItemService from "../services/cart-item.service.ts";
import * as cartService from "../services/cart.service.ts";

export async function createCartItem(req: Request, res: Response) {
  const { productId, quantity } = createCartItemBodySchema.parse(req.body);

  let cartId: number;

  if (req.session.cartId !== undefined) {
    // Buscamos el carrito que le pertenece al usuario
    const cart = await cartService.getCart(req.session.cartId);
    if (cart === null) {
      delete req.session.cartId; // Limpiamos el cartId De la session
      throw new ApiError(409, "El carrito de la session ya no existe");
    }

    cartId = cart.id;
  } else {
    const cart = await cartService.createCart(req.session.userId);
    req.session.cartId = cart.id;
    cartId = cart.id;
  }

  // Crear un cart-item
  const item = await cartItemService.createCartItem(
    productId,
    cartId,
    quantity,
  );

  res.status(201).json({ status: "success", data: item });
}

export async function updateCartItem(req: Request, res: Response) {
  const cartId = req.session.cartId;

  // Verificar si el usuario cuenta con un cartId en su sesion
  if (cartId === undefined) {
    throw new ApiError(404, "Carrito no existe");
  }

  // Verificar si el carrito existe en la base de datos
  const cart = await cartService.getCart(cartId);

  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(409, "El carrito de la sesion ya no existe");
  }

  const { id } = idParamsSchema.parse(req.params);
  const { quantity } = updateCartItemBodySchema.parse(req.body);

  const item = await cartItemService.updateCartItemQuantity(
    cartId,
    id,
    quantity,
  );

  res.status(200).json({ status: "success", data: item });
}

export async function deleteCartItem(req: Request, res: Response) {
  const cartId = req.session.cartId;

  // Verificar si el usuario cuenta con un cartId en su sesion
  if (cartId === undefined) {
    throw new ApiError(404, "Carrito no existe");
  }

  // Verificar si el carrito existe en la base de datos
  const cart = await cartService.getCart(cartId);

  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(409, "El carrito de la sesion ya no existe");
  }

  const { id } = idParamsSchema.parse(req.params);

  await cartItemService.deleteCartItem(cartId, id);
  res.status(204).send();
}
