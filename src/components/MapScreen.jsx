import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";
import supabae from "../../lib/supabase";

const getUserGeoLocation = async () => {
  const cameraPostion = {
    coordinates: {
      latitude: locationData?.latitude,
      longitude: locationData?.longitude,
    },
    zoom: 20,
  };
};

// confirm user their adress
const confirm = () => {
  <>
    <View>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85}>
        <Text>confirm</Text>
      </TouchableOpacity>
    </View>
  </>;
};

// getting user location from database
const { data: locationData, error } = await supabae
  .from("profile")
  .select("latitude")
  .eq("id", session.user.id)
  .single();

export default function MapScreen() {
  if (Platform.OS === "ios") {
    return (
      <AppleMaps.View style={{ flex: 1 }} cameraPostion={{ cameraPostion }} />
    );
  } else if (Platform.OS === "android") {
    return (
      <GoogleMaps.View style={{ flex: 1 }} cameraPosition={cameraPosition} />
    );
  } else {
    return <Text>Maps are only available on android and iosl</Text>;
  }
}
