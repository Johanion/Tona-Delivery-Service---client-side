import  {supabase} from "../lib/supabase"

export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const { data, error } = await supabase.functions.invoke("smooth-function", {
      body: {
        type: "reverse",
        lat: latitude,
        lng: longitude,
      },
    });

    if (error) {
      console.error("Edge Function Error:", error);
      throw error;
    }

    // OpenCage returns results in an array. 
    // We check for 'formatted' instead of 'formatted_address'
    return data?.results?.[0]?.formatted || "Address not found";
  } catch (error) {
    console.log(error)
  }
};``