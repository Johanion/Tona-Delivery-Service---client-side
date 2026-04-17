import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserLocation } from "../hooks/getUserLocation.js";
import { getAddressFromCoords } from "./LocationGeocoding.jsx";
import { supabase } from "../lib/supabase";

// caching user adress
const GetLocation = async (userID) => {
  try {
    //1. first try to get adress from local storage with id -- "userAdress"
    const storedAdress = await AsyncStorage.getItem("userAdressss");
    console.log(
      "stored adressssssssssssssssssssssssssssssssssssssss",
      storedAdress,
    );
    if (storedAdress !== null) {
      return storedAdress;
    }

    //2. request user and access their adress
    const reqLocation = await getUserLocation();
    let realAdress = null;
    // get the reverse geocoded adress of location
    if (reqLocation) {
      realAdress = await getAddressFromCoords(
        reqLocation.latitude,
        reqLocation.longitude,
      );
    } else return null;

    // inserting to databse
    const { data: addressData, error: addressError } = await supabase
      .from("address")
      .insert([
        {
          latitude:   reqLocation.latitude,
          longitude: reqLocation.longitude,
          adress: realAdress,
        },
      ])
      .select()
      .single();

    if (addressError) throw addressError;

    // STEP 2: Link this address to the user in the junction table
    const { error: linkError } = await supabase.from("address_profile").insert([
      {
        user_id: userID,
        address_id: addressData.id,
        label: "primary Adress", // "Home", "Work", etc.
        is_default: true,
      },
    ]);

    if (linkError) throw linkError;

    // send the data to adress table
    //  try {
    //  const { data: adressData, error: adressError } = await supabase
    //     .from("adress")
    //     .insert({
    //         "adress": realAdress,
    //         "latitude": reqLocation.lat,
    //         "longitude": reqLocation.lon
    //     }).select()
    //       .single();

    //   // inserting the adress id to the user in the profile table
    //   const {data: profileData, error: profileError} = await supabase
    //       .from("profile")
    //       .insert({
    //         adress_id: adressData.id
    //       })
    //     } catch(error){
    //       console.log(error)
    //     }

    // getting user adress if it is not availabe in async storage
    // const getUserAdress = (adress) => {
    //   if (!adress) return; // handle empty/null input
    //   // Trim spaces and split by space
    //   return adress.trim().split(" ")[0];
    // };

    // saving to local cache
    // const userAdress = getUserAdress(data.adress);
    // if (!error && data) {

    await AsyncStorage.setItem("userAdressss", realAdress); // cache it
    return realAdress;

    // } else {
    //   console.warn("data is not saved in the databse")

    // }
  } catch (err) {
    console.log("Error loading name", err);
  }
};

export default GetLocation;
