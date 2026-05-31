import * as db from "../db/index.ts";
import { ApiError } from "../lib/errors.ts";
import * as cartRepository from "../repositories/cart.repository.ts";
import * as orderRepository from "../repositories/order.repository.ts";
import * as cartService from "./cart.service.ts";

interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: string;
  phone: string;
}

export type OrderWithItems = orderRepository.Order & {
  items: orderRepository.OrderItem[];
};

export async function createOrder(
  cartId: number,
  shippingInfo: ShippingInfo,
  userId?: number,
) {
  const cart = await cartService.getHydratedCart(cartId);

  if (cart === null) throw new Error("No se encontro carrito");
  if (cart.items.length === 0)
    throw new ApiError(400, "No hay productos en el carrito");

  const order = await db.withTransaction(async (client) => {
    const createOrderData: orderRepository.CreateOrderData = {
      ...shippingInfo,
      userId: userId ?? null,
      total: cart.totalPrice,
    };
    const order = await orderRepository.createOrder(createOrderData, client);

    const items = cart.items.map((item) => {
      return {
        orderId: order.id,
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        imgSrc: item.product.imgSrc,
        quantity: item.quantity,
      };
    });

    await orderRepository.createOrderItems(items, client);
    await cartRepository.remove(cart.id);

    return order;
  });

  return order;
}

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  const order = await orderRepository.findById(id);
  console.log(order);
  if (order === null) return null;

  const items = await orderRepository.findItemsByOrderId(id);
  return {
    ...order,
    items,
  };
}
