import { supabase } from "../lib/supabase";

export const deletePostFavouriteProduct = async (product_id, user_id) => {
    const { data, error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user_id)
        .eq("product_id", product_id);
}   


export const deletePostFavouriteOrder = async (user_id, id) => {
    const { data, error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user_id)
        .eq("order_id", id);
}   

