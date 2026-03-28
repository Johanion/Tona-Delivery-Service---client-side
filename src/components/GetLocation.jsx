import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {useUserLocation} from "../../hooks/useUserLocation.js"
import {getAddressFromCoords} from "../../LocationGeocoding"

const [adress, setAdress] = useState(null);


// caching user adress
useEffect(() => {
  const loadAdress = async () => {
    try {
      //1. first try to get adress from local storage with id -- "userAdress"
      const storedAdress = await AsyncStorage.getItem("userAdress");
      if (storedAdress !== null) {
        setAdress(storedAdress);
        return
      }

     //2. request user and access their adress
     const {reqLocation} = await useUserLocation()

     // get the geocoded adress of location
     const realAdress = await getAddressFromCoords(reqLocation.lat, reqLocation.lon)

     // send the data to database
     const { data, error } = await supabase
        .from("profile")
        .insert({
            "adress": realAdress,
            "latitude": reqLocation.lat,
            "longitude": reqLocation.lon
        })
      
      // getting user adress if it is not availabe in async storage
      const getUserAdress = (adress) => {
        if (!adress) return; // handle empty/null input
        // Trim spaces and split by space
        return adress.trim().split(" ")[0];
      };

      // saving to local cache
      const userAdress = getUserAdress(data.adress);
      if (!error && data) {
        setAdress(userAdress);
        await AsyncStorage.setItem("userAdress", userAdress); // cache it
      } else {
      
      }
    } catch (err) {
      console.log("Error loading name", err);
    }
  };

  loadAdress();
}, [session]);
