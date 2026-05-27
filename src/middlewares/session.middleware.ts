import pgSession from "connect-pg-simple";
import session from "express-session";
import { pool } from "../db/index.ts";
import { env } from "../env.ts";

const PgStore = pgSession(session);

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const sessionMiddleware = session({
  store: new PgStore({ pool }),
  secret: env.SESSION_SECRET ?? "secreto",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: ONE_WEEK_MS },
});

// No envio cookie connect.sid = undefined
// Buscar SessionStore.get(sessionId)  -> Es un usuario nuevo -> req.session.cardId = undefined
// En el controlador req.session.cartId = cart.id
// Antes de enviar la respuesta verificamos que req.session tenga algun dato, si lo hemos modificado: LLamamos al metodo SessionStore.set(sessionId, req.session) y si no, entonces no guardamos dicha session; Se limpia req.session
// Enviamos la respuesta al usuario, y el usuario recibe el connect.id si es que el servidor le envia una cookie.

// Peticion 2
// El cliente ya envia el connect.sid = abc123
// Buscar en SessionStore.get(sessionId)  -> Es el mismo usuario -> req.session.cardId = 5
// No enviamos la session al usuario.
