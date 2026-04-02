import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getUserLocation } from "../hooks/getUserLocation.js";
import { getAddressFromCoords } from "./LocationGeocoding.jsx";

// caching user adress
const GetLocation = async () => {
  try {
    //1. first try to get adress from local storage with id -- "userAdress"
    const storedAdress = await AsyncStorage.getItem("userAdress");
    console.log(
      "stored adressssssssssssssssssssssssssssssssssssssss",
      storedAdress,
    );
    if (storedAdress !== null) {
      return storedAdress;
    }

    //2. request user and access their adress
    const reqLocation = await getUserLocation();

    // get the reverse geocoded adress of location
    if (reqLocation) {
      const realAdress = await getAddressFromCoords(
        reqLocation.latitude,
        reqLocation.longitude,
      );
    } else return null;

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

    await AsyncStorage.setItem("userAdress", realAdress); // cache it
    return realAdress;

    // } else {
    //   console.warn("data is not saved in the databse")

    // }
  } catch (err) {
    console.log("Error loading name", err);
  }
};

export default GetLocation;
