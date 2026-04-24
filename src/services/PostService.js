import { visitNode } from "typescript";
import { supabase } from "../lib/supabase";
// inserting favourites to the database (id belongs to >> order, product, vendor e.t.c)
export const insertFavouriteProduct = async (user_id, id) => {
  const { data, error } = await supabase
    .from("favourites")
    .insert({ user_id: user_id, product_id: id });


    console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.", data);
    console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr.", error);
};



// inserting favourites to the database (id belongs to >> order, product, vendor e.t.c)
export const insertPostFavouriteOrder = async (user_id, id) => {
  const { data, error } = await supabase
    .from("favourites")
    .insert({ user_id: user_id, order_id: id });

  if (error) throw error;
  return data;
};

