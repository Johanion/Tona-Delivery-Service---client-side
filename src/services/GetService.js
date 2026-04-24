import { supabase } from "../lib/supabase";

export const fetchFavouriteProductIds = async (userId) => {
  const { data, error } = await supabase
    .from("favourites")
    .select("product_id")
    .eq("user_id", userId)
    .not("product_id", "is", null);

  if (error) throw error;
  return data?.map((item) => item.product_id) || [];
};

export const fetchFavouriteVendorIds = async (userId) => {
  const { data, error } = await supabase
    .from("favourites")
    .select("vendor_id")
    .eq("user_id", userId)
    .not("vendor_id", "is", null);

  if (error) throw error;
  return data?.map((item) => item.vendor_id) || [];
};

export const fetchFavouriteOrderIds = async (userId) => {
  const { data, error } = await supabase
    .from("favourites")
    .select("order_id")
    .eq("user_id", userId)
    .not("order_id", "is", null);

  if (error) throw error;
  return data?.map((item) => item.order_id) || [];
};
