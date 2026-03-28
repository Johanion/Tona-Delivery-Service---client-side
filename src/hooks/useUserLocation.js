// hooks/useUserLocation.js
import * as Location from "expo-location";

export const getUserLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  let loc = await Location.getCurrentPositionAsync({});

  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  };
};