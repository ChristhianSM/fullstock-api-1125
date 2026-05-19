import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";

export async function createCartItem(
  productId: number,
  cartId: number,
  quantity: number,
): Promise<cartItemRepository.CartItem> {
  const productFind = await cartItemRepository.findByCartAndProduct(
    productId,
    cartId,
  );
  if (productFind) {
    throw new ApiError(409, "El producto ya existe en el carrito");
  }

  return cartItemRepository.create(productId, cartId, quantity);
}

export async function updateCartItemQuantity(
  cartId: number,
  id: number,
  quantity: number,
) {
  const item = await cartItemRepository.findById(id);

  if (item === null || item.cartId !== cartId) {
    throw new ApiError(404, "El item no existe en el carrito");
  }

  const updatedItem = await cartItemRepository.updateQuantity(id, quantity);
  await cartRepository.touch(cartId);
  console.log("aquiiiii");
  return updatedItem;
}

export async function deleteCartItem(cartId: number, id: number) {
  const item = await cartItemRepository.findById(id);
  if (item === null || item.cartId !== cartId) {
    throw new ApiError(404, "El item no existe en el carrito");
  }

  await cartItemRepository.remove(id);
  await cartRepository.touch(cartId);
}
