import React, { useState } from "react";
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
import supabase from "../../lib/supabase"; 
import { getAddressFromCoords } from "../../components/LocationGeocoding";
import { useAuth } from "../../providers/AuthProvider";

export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { session } = useAuth();

  // 1. Safe coordinate extraction to fix the "undefined" error
  const handleMapPress = (e) => {
    const coords = e.nativeEvent?.coordinate || e.nativeEvent;
    
    if (coords && coords.latitude) {
      setSelectedLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      console.log("Pin dropped at:", coords.latitude, coords.longitude);
    }
  };

  const confirmLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("Please select a location first!");
      return;
    }

    try {
      // Get the readable address string
      const realAdress = await getAddressFromCoords(
        selectedLocation.latitude,
        selectedLocation.longitude
      );

      const { data, error } = await supabase
        .from("adress") // Ensure this matches your DB spelling
        .update({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          adress: realAdress,
        })
        .eq("id", session.user.id);

      if (error) throw error;
      Alert.alert("Success", "Delivery location saved!");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const defaultLocation = {
    latitude: 9.03,
    longitude: 38.74,
  };

  const cameraPositions = {
    coordinates: defaultLocation,
    zoom: 15,
  };

  // Helper component to render the Pin
  const MapMarkers = () => {
    if (!selectedLocation) return null;
    
    return Platform.OS === "ios" ? (
      <AppleMaps.Marker coordinate={selectedLocation} title="Deliver here" />
    ) : (
      <GoogleMaps.Marker coordinate={selectedLocation} title="Deliver here" />
    );
  };

  const ConfirmButon = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={confirmLocation}>
        <Text style={styles.buttonText}>Confirm Location</Text>
      </TouchableOpacity>
      {selectedLocation && (
        <View style={styles.infoBadge}>
          <Text style={styles.selectedText}>
            {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {Platform.OS === "ios" ? (
            <AppleMaps.View
              style={StyleSheet.absoluteFill}
              cameraPosition={cameraPositions}
              onMapClick={handleMapPress}
            >
              <MapMarkers />
            </AppleMaps.View>
          ) : (
            <GoogleMaps.View
              style={StyleSheet.absoluteFill}
              cameraPosition={cameraPositions}
              onMapClick={handleMapPress}
            >
              <MapMarkers />
            </GoogleMaps.View>
          )}
          <ConfirmButon />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
});