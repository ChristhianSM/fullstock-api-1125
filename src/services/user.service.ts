import { ApiError } from "../lib/errors.ts";
import * as password from "../lib/password.ts";
import * as userRepository from "../repositories/user.repository.ts";

export async function createUser(
  email: string,
  plainPassword: string,
): Promise<userRepository.PublicUser> {
  const exitingUser = await userRepository.findByEmail(email);

  if (exitingUser !== null) {
    throw new ApiError(409, "El email ya ha sido registrado con anterioridad");
  }

  const passwordHash = await password.hash(plainPassword);

  const user = await userRepository.create(email, passwordHash);

  const { password: _password, ...publicUser } = user;

  return publicUser;
}

export async function verifyCredentials(
  email: string,
  plainPassword: string,
): Promise<userRepository.PublicUser> {
  const user = await userRepository.findByEmail(email);

  if (user === null) {
    throw new ApiError(401, "Credenciales Invalidas");
  }

  const match = await password.compare(plainPassword, user.password);

  if (!match) {
    throw new ApiError(401, "Credenciales Invalidas");
  }

  const { password: _password, ...publicUser } = user;

  return publicUser;
}
