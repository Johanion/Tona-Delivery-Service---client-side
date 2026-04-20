import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserLocation } from "../hooks/getUserLocation.js";
import { getAddressFromCoords } from "./LocationGeocoding.jsx";
import { supabase } from "../lib/supabase";

// caching user address
const GetLocation = async (userID) => {
  try {
    //1. first try to get address from local storage with id -- "userAddress"
    const storedAddress = await AsyncStorage.getItem("userAddress");
    console.log(
      "stored addressssssssssssssssssssssssssssssssssssssss",
      storedAddress,
    );
    if (storedAddress !== null) {
      return storedAddress;
    }

    //2. request user and access their address
    const reqLocation = await getUserLocation();
    let realAddress = null;
    // get the reverse geocoded address of location
    if (reqLocation) {
      realAddress = await getAddressFromCoords(
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
          address: realAddress,
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
        label: "primary Address", // "Home", "Work", etc.
        is_default: true,
      },
    ]);

    if (linkError) throw linkError;

    // send the data to address table
    //  try {
    //  const { data: addressData, error: addressError } = await supabase
    //     .from("address")
    //     .insert({
    //         "address": realAddress,
    //         "latitude": reqLocation.lat,
    //         "longitude": reqLocation.lon
    //     }).select()
    //       .single();

    //   // inserting the address id to the user in the profile table
    //   const {data: profileData, error: profileError} = await supabase
    //       .from("profile")
    //       .insert({
    //         address_id: addressData.id
    //       })
    //     } catch(error){
    //       console.log(error)
    //     }

    // getting user address if it is not availabe in async storage
    // const getUserAddress = (address) => {
    //   if (!address) return; // handle empty/null input
    //   // Trim spaces and split by space
    //   return address.trim().split(" ")[0];
    // };

    // saving to local cache
    // const userAddress = getUserAddress(data.address);
    // if (!error && data) {

    await AsyncStorage.setItem("userAddressss", realAddress); // cache it
    return realAddress;

    // } else {
    //   console.warn("data is not saved in the databse")

    // }
  } catch (err) {
    console.log("Error loading name", err);
  }
};

export default GetLocation;
