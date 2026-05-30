import * as db from "../db/index.ts";
import { ApiError } from "../lib/errors.ts";
import * as cartItemRepository from "../repositories/cart-item.repository.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as productService from "../services/product.service.ts";

export interface HydratedCartItem {
  id: number;
  quantity: number;
  lineTotal: number; // Subtotal
  product: {
    id: number;
    title: string;
    slug: string;
    price: number;
    imgSrc: string;
  };
}

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
    console.log("first");
    throw new ApiError(409, "El producto ya existe en el carrito");
  }

  // Validar que el producto exista
  const product = await productService.getProductById(productId);

  if (product === null)
    throw new ApiError(400, "Producto que desea agregar no existe");

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

export async function getHydratedItemsByCartId(
  cartId: number,
): Promise<HydratedCartItem[]> {
  const items = await cartItemRepository.getItemsWithProductsByCartId(cartId);
  return items.map((item) => {
    const { id, quantity, price, productId, title, slug, imgSrc } = item;
    return {
      id,
      quantity,
      lineTotal: price * quantity,
      product: {
        id: productId,
        title,
        slug,
        price,
        imgSrc,
      },
    };
  });
}

export async function mergeVisitorCartIntoUserCart(
  visitorCartId: number,
  userCartId: number,
): Promise<void> {
  await db.withTransaction(async (client) => {
    // Items del usuario anonimo
    const visitorItems = await cartItemRepository.getByCartId(
      visitorCartId,
      client,
    );

    for (const visitorItem of visitorItems) {
      // Verificamos que el item del usuario visitante, se encuentre en el carrito del usuario autenticado.
      // Item del usuario autenticado.
      const exitingItem = await cartItemRepository.findByCartAndProduct(
        visitorItem.productId,
        userCartId,
        client,
      );

      if (exitingItem === null) {
        // Si no existe el item del usuario invitado, entonces, movemos el item al carrito del usuario autenticado-
        await cartItemRepository.moveToCart(visitorItem.id, userCartId, client);
      } else {
        // Si el producto del usuario visitante, si existe en el carrito del usuario autenticado, entonces, las cantidad
        // de ambos productos se suman

        const quantityFinal = exitingItem.quantity + visitorItem.quantity;

        await cartItemRepository.updateQuantity(
          exitingItem.id,
          quantityFinal,
          client,
        );
      }

      // Eliminamos el carrito del usuario anonimo
      await cartRepository.remove(visitorCartId, client);
    }
  });
}
