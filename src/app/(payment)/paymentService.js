// src/services/paymentService.js
import * as WebBrowser from "expo-web-browser";
import { supabaseServerLess } from "../../lib/supabaseServerLess";

const startChapaPayment = async (session, cart, deliveryNote) => {
  const userId = session.user.id;
  if (!userId) {
    throw new Error("Try Again Later");
  }

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    throw new Error("Cart is empty or invalid");
  }
  // 1. Call Edge Function
  const { data, error } = await supabaseServerLess.functions.invoke(
    "smooth-worker",
    {
      body: {
        user_id: userId,
        cart: cart,
        description: deliveryNote
      },
    },
  );

  if (error || data?.status !== "success") {
    throw new Error(error || "Payment initialization failed");
  }

  // 2. get checkout url
  const checkout_URL = data.data.checkout_url;

  // 3. Open Browser
  return await WebBrowser.openBrowserAsync(checkout_URL);
};

export default startChapaPayment;
