import type { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { es } from "zod/locales";
import { ApiError } from "../lib/errors.ts";

//Configuro el idioma de los mensajes de error del validador
z.config(es());

export function notFoundHandler() {
  throw new ApiError(404, "Recurso no encontrado.");
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof z.ZodError) {
    res.status(422).json({
      error: "Los datos no son validos",
      fields: z.flattenError(err).fieldErrors,
    });

    return;
  }

  res.status(500).json({ error: "Error interno del servidor" });
}
