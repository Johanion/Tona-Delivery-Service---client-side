// src/services/paymentService.js
import * as WebBrowser from "expo-web-browser";
import { supabaseServerLess } from "../../lib/supabaseServerLess";

const startChapaPayment = async (amount, session, cart) => {
  const userId = session.user.id;
  if (!userId) {
    throw new Error("You must be logged in to make a payment.");
  }

  // 1. Call Edge Function
  const { data, error } = await supabaseServerLess.functions.invoke(
    "smooth-worker",
    {
      body: {
        amount: amount,
        user_id: userId,
        items: cart
      },
    },
  );

  if (error || data?.status !== "success") {
    throw new Error(error || "Payment initialization failed");
  }

  // 3. Open Browser
  return await WebBrowser.openBrowserAsync(data.data.checkout_url);
};

export default startChapaPayment;
