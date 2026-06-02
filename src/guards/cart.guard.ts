import type { Request } from "express";
import { ApiError } from "../lib/errors.ts";
import { type Cart } from "../repositories/cart.repository.ts";
import * as cartService from "../services/cart.service.ts";

export async function requireCart(
  req: Request,
  isCartHydrated?: boolean,
): Promise<Cart | cartService.HydratedCart> {
  const cartId = req.session.cartId;

  if (cartId === undefined) {
    throw new ApiError(404, "El carrito no existe");
  }
  let cart;

  if (isCartHydrated) {
    cart = await cartService.getHydratedCart(cartId);
  } else {
    cart = await cartService.getCart(cartId);
  }

  if (cart === null) {
    delete req.session.cartId;
    throw new ApiError(
      409,
      "El carrito de la session ya no existe en la base de datos",
    );
  }

  return cart;
}
