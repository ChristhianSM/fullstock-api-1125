import { Session } from "express-session";

export const SESSION_COOKIE_NAME = "connect.sid";

export async function destroySession(session: Session) {
  await new Promise<void>((resolve, reject) => {
    session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
