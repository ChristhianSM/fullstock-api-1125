import type { Request, Response } from "express";
import { destroySession, SESSION_COOKIE_NAME } from "../lib/sessions.ts";
import { loginBodySchema } from "../schemas/auth.schema.ts";
import * as userService from "../services/user.service.ts";

export async function createSession(req: Request, res: Response) {
  const { email, password } = loginBodySchema.parse(req.body);

  const user = await userService.verifyCredentials(email, password);

  req.session.userId = user.id;

  res.status(200).json({ status: "success", data: user });
}

export async function deleteSession(req: Request, res: Response) {
  await destroySession(req.session);

  res.clearCookie(SESSION_COOKIE_NAME);

  res.status(204).send();
}
