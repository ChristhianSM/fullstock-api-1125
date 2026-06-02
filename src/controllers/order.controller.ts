import type { Request, Response } from "express";
import { requireCart } from "../guards/cart.guard.ts";
import { ApiError } from "../lib/errors.ts";
import { createOrderBodySchema } from "../schemas/order.schema.ts";
import { idParamsSchema } from "../schemas/params.schema.ts";
import * as orderService from "../services/order.service.ts";
import * as userService from "../services/user.service.ts";

export async function createOrder(req: Request, res: Response) {
  const userId = req.session.userId;

  const cart = await requireCart(req);

  // Validar el body
  const body = createOrderBodySchema.parse(req.body);

  if (userId !== undefined) {
    const user = await userService.getUserById(userId);
    if (user === null) throw new ApiError(401, "Usuario no encontrado");
    body.email = user.email;
  }

  const order = await orderService.createOrder(cart.id, body, userId);
  req.session.lastOrderId = order.id;

  delete req.session.cartId;

  res.status(201).json({ status: "success", data: order });
}

export async function getOrder(req: Request, res: Response) {
  const { id } = idParamsSchema.parse(req.params);

  console.log(req.session.lastOrderId);

  const order = await orderService.getOrderById(id);

  if (order === null) {
    throw new ApiError(404, "Order no encontrada");
  }

  const userId = req.session.userId;
  // Validacion para ver si el usuario que llamo a este enpoint, es el mismo usuario que creo la orden.
  const isOwner = order.userId !== null && order.userId === userId;

  // Validacion para ver si la sesion tiene la ultima orden creada
  const isJustCreated = req.session.lastOrderId === id;

  if (!isOwner && !isJustCreated) {
    throw new ApiError(404, "Order no encontrada");
  }

  res.status(200).json({ status: "success", data: order });
}

// Usuario autenticado que llama a una orden que no es suya:
// const userId = req.session.userId;  userId = 3;

//  const isOwner = order.userId !== null && order.userId === userId;  V && 1 === 3 = V && F = F

//  const isJustCreated = req.session.lastOrderId === id;  undefined === 2 = F

//  if (!isOwner && !isJustCreated) { !F && !F  = V && V = V
//    throw new ApiError(404, "Order no encontrada");
//  }

// Usuario autenticado que llama a una orden si creo:
// const userId = req.session.userId;  userId = 1;

//  const isOwner = order.userId !== null && order.userId === userId;  V && 1 === 1 = V && V = V

//  const isJustCreated = req.session.lastOrderId === id;  undefined === 2 = F

//  if (!isOwner && !isJustCreated) { !V && !F  = F && V = F
//    throw new ApiError(404, "Order no encontrada");
//  }
