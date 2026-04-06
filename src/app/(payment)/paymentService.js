// src/services/paymentService.js
import * as WebBrowser from "expo-web-browser";
import { supabaseServerLess } from "../../lib/supabaseServerLess";

const startChapaPayment = async (amount) => {
  // 2. Call Edge Function
  const { data, error } = await supabaseServerLess.functions.invoke(
    "smooth-worker",
    {
      body: {
        amount: amount,
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
