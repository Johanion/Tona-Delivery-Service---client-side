// src/services/atoms.jsx
import { atom } from "jotai";

// cartAtom stores an array of objects { id, product info..., amount }
export const cartAtom = atom([]);
export const selectedPaymentEnd = atom(null);
export const totalAmount = atom (null)
export const RestaurantId = atom (null)
export const RestaurantName = atom (null)
export const checkoutProductsAtom = atom([]);

// Add a product by ID or increment
export const addToCartAtom = atom(
  null,
  (get, set, product) => {
    const cart = get(cartAtom);
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      // increment only this product's amount
      set(
        cartAtom,
        cart.map((p) =>
          p.id === product.id ? { ...p, amount: p.amount + 1 } : p
        )
      );
    } else {
      // add new product with amount 1
      set(cartAtom, [...cart, { ...product, amount: 1 }]);
    }
  }
);

// Remove or decrement product by ID
export const removeFromCartAtom = atom(
  null,
  (get, set, id) => {
    const cart = get(cartAtom);
    const existing = cart.find((p) => p.id === id);
    if (!existing) return;

    if (existing.amount > 1) {
      set(
        cartAtom,
        cart.map((p) =>
          p.id === id ? { ...p, amount: p.amount - 1 } : p
        )
      );
    } else {
      set(cartAtom, cart.filter((p) => p.id !== id));
    }
  }
);