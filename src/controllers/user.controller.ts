import type { Request, Response } from "express";
import { ApiError } from "../lib/errors.ts";
import { destroySession, SESSION_COOKIE_NAME } from "../lib/sessions.ts";
import { authBodySchema } from "../schemas/auth.schema.ts";
import * as cartService from "../services/cart.service.ts";
import * as userService from "../services/user.service.ts";

export async function createUser(req: Request, res: Response) {
  const { email, password } = authBodySchema.parse(req.body);

  const user = await userService.createUser(email, password);

  req.session.userId = user.id;

  const cartId = await cartService.resolveCart(req.session.cartId, user.id);

  if (cartId !== undefined) {
    req.session.cartId = cartId;
  }

  res.status(201).json({ status: "success", data: user });
}

export async function getCurrentUser(req: Request, res: Response) {
  const userId = req.session.userId;

  if (userId === undefined) {
    throw new ApiError(401, "Usuario no autenticado");
  }

  const user = await userService.getUserById(userId);

  if (user === null) {
    await destroySession(req.session);
    res.clearCookie(SESSION_COOKIE_NAME);
    throw new ApiError(401, "Usuario no autenticado");
  }

  res.status(200).json({ status: "success", data: user });
}
