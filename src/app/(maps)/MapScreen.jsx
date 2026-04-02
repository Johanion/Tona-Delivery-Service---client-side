import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppleMaps, GoogleMaps } from "expo-maps";
import supabase from "../../lib/supabase"; // your Supabase client

export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Handle map press: only update state
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    console.log("Selected location:", latitude, longitude);
  };

  // Confirm location and send to Supabase
  const confirmLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("Please select a location first!");
      return;
    }

    // try {
    //   const { data, error } = await supabase
    //     .from("profile")
    //     .update({
    //       latitude: selectedLocation.latitude,
    //       longitude: selectedLocation.longitude,
    //     })
    //     .eq("id", session.user.id);

    //   if (error) throw error;
    //   Alert.alert("Location saved successfully!");
    //   console.log("Saved location:", data);
    // } catch (err) {
    //   Alert.alert("Error saving location", err.message);
    // }
  };

  // Default location (can fetch from DB instead)
  const locationData = {
    latitude: 9.03,
    longitude: 38.74,
  };

  const cameraPositions = {
    coordinates: {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    },
    zoom: 15,
  };

  // Confirm buttont UI
  const ConfirmButon = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={confirmLocation}>
        <Text style={styles.buttonText}>Confirm Location</Text>
      </TouchableOpacity>
      {selectedLocation && (
        <Text style={styles.selectedText}>
          Selected: {selectedLocation.latitude.toFixed(5)},{" "}
          {selectedLocation.longitude.toFixed(5)}
        </Text>
      )}
    </View>
  );

  // Render map
  if (Platform.OS === "ios") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, marginBottom: 15 }}>
            <AppleMaps.View
              style={StyleSheet.absoluteFill}
              cameraPosition={cameraPositions}
              onMapClick={handleMapPress}
            />
            <ConfirmButon />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else if (Platform.OS === "android") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, marginBottom: 70 }}>
            <GoogleMaps.View
              style={StyleSheet.absoluteFill}
              cameraPosition={cameraPositions}
              onMapClick={handleMapPress}
            />
            <ConfirmButon />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    marginTop: 8,
    color: "#333",
    fontSize: 14,
  },
});
