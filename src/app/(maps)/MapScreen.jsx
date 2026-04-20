import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleMaps, AppleMaps } from "expo-maps";
import {
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { getAddressFromCoords } from "../../components/LocationGeocoding";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import Modal from "react-native-modal";

export default function MapScreen() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 9.03, // Default Addis Ababa
    longitude: 38.74,
  });
  const { session } = useAuth();
  const [visible, setVisible] = useState(false);

  const handleModalEffect = async () => {
    setVisible(true);
  };

  const confirmLocation = async (selectedLabel) => {
    setVisible(false);
    if (!selectedLocation) {
      Alert.alert("Please wait for location to load");
      return;
    }

    try {
      // Get the readable address string (e.g., "Bole, Addis Ababa")
      const realAddress = await getAddressFromCoords(
        selectedLocation.latitude,
        selectedLocation.longitude,
      );

      // store locally
      await AsyncStorage.setItem("userAddress", realAddress); // cache it

      const { data: addressData, error: addressError } = await supabase
        .from("address")
        .insert([
          {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: realAddress,
          },
        ])
        .select()
        .single();

      if (addressError) throw addressError;

      // STEP 2: Link this address to the user in the junction table
      const { error: linkError } = await supabase
        .from("address_profile")
        .insert([
          {
            user_id: session.user.id,
            address_id: addressData.id,
            label: selectedLabel || "Home", // "Home", "Work", etc.
            is_default: true,
          },
        ]);

      if (linkError) throw linkError;

      Alert.alert("Success", `Delivery location saved: ${realAddress}`);
      router.back()
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const cameraPositions = {
    coordinates: {
      latitude: 9.03,
      longitude: 38.74,
    },
    zoom: 15,
  };

  // Logic to update coordinates as map moves
  const handleCameraMove = (e) => {
    // In expo-maps, the current center is in cameraPosition.coordinates
    if (e?.coordinates) {
      setSelectedLocation(e.coordinates);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* MAP VIEW */}
          {Platform.OS === "ios" ? (
            <AppleMaps.View
              style={StyleSheet.absoluteFill}
              cameraPosition={cameraPositions}
              onCameraMove={handleCameraMove}
            />
          ) : (
            <GoogleMaps.View
              style={StyleSheet.absoluteFill}
              cameraPosition={cameraPositions}
              onCameraMove={handleCameraMove}
            />
          )}

          {/* THE RED PIN OVERLAY (Fixed in Center) */}
          {/* pointerEvents="none" allows clicks to pass through the pin to the map */}
          <View style={styles.pinWrapper} pointerEvents="none">
            <View style={styles.pinContainer}>
              <Ionicons name="location-sharp" size={50} color="#FF0000" />
            </View>
          </View>

          {/* CONFIRM BUTTON */}
          <View style={styles.buttonContainer}>
            <View style={styles.addressCard}>
              <Text style={styles.addressLabel}>
                DELIVER TO CENTER OF RED PIN
              </Text>
              <Text style={styles.coordsText}>
                {selectedLocation.latitude.toFixed(5)},{" "}
                {selectedLocation.longitude.toFixed(5)}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleModalEffect}>
              <Text style={styles.buttonText}>Confirm Delivery Spot</Text>
            </TouchableOpacity>

            {/* select label modal */}
            <View style={styles.overlay}>
              <Modal transparent visible={visible} animationType="fade">
                <View style={styles.overlay}>
                  <View style={styles.container}>
                    {/* Icon */}
                    <View style={styles.iconBox}>
                      <Ionicons
                        name="location-sharp"
                        size={32}
                        color="#FF6B00"
                      />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>your location</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                      which one is your selected location
                    </Text>

                    {/* buttons */}
                    <View style={{ justifyContent: "center", width: "100%" }}>
                      <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => {
                          confirmLocation("Home");
                        }}
                      >
                        <Ionicons
                          name="home"
                          size={30}
                          color="white"
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.confirmText}>Home</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => {
                          confirmLocation("Office");
                        }}
                      >
                        <Ionicons
                          name="briefcase"
                          size={30}
                          color="white"
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.confirmText}>Office</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => {
                          confirmLocation("Gym");
                        }}
                      >
                        <Ionicons
                          name="barbell"
                          size={30}
                          color="white"
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.confirmText}>Gym</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => {
                          confirmLocation("other");
                        }}
                      >
                        <Ionicons
                          name="ellipsis-horizontal-circle"
                          size={30}
                          color="white"
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.confirmText}>other</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => setVisible(false)}
                      >
                        <Text style={styles.cancelText}>cancel</Text>
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={()=>{
                          confirmLocation()
                        }}
                      >
                        <Text style={styles.confirmText}>Confirm</Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Pin Styles
  pinWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  pinContainer: {
    alignItems: "center",
    marginBottom: 36, // Adjust this so the "point" is exactly in the center
  },
  pinHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FF0000", // Red
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pinTail: {
    width: 4,
    height: 10,
    backgroundColor: "#FF0000",
    marginTop: -2,
  },
  pinShadow: {
    width: 12,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 6,
    marginTop: 2,
  },

  // UI Styles
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  addressCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  addressLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "bold",
    marginBottom: 2,
  },
  coordsText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FF0000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modal: { justifyContent: "flex-end", margin: 0, marginBottom: 30 },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#EEE",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 25,
    textAlign: "center",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FBFBFB",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  paymentName: { fontSize: 17, fontWeight: "800", color: "#1A1A1A" },
  paymentSub: { fontSize: 12, color: "#999", marginTop: 2 },
  miniBadge: {
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  closeModal: { marginTop: 10, padding: 15, alignItems: "center" },
  closeModalText: { color: "#BBB", fontWeight: "700", fontSize: 15 },
  vendorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  buttonRow: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    alignItems: "center",
  },

  confirmBtn: {
    margin: 5,
    padding: 12,
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  cancelText: {
    color: "#333",
    fontWeight: "600",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
