import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import ConfirmModal from "../../components/ConfirmModal.jsx";
import RenderingFeaturesCategories from "../../components/RenderingFeaturesCategories.jsx";
import RenderingVendors from "../../components/RenderingVendors.jsx";
import featuredCategoriesData from "../../constants/featuredCategoriesData.js";
import { Modal } from "react-native";

import { useAtom } from "jotai";
import { useAuth } from "../../providers/AuthProvider";
import { cartAtom } from "../../atom";
import GetLocation from "../../components/GetLocation.js";
import { supabase } from "../../lib/supabase";

const index = () => {
  const [isModalon, setIsModalOn] = useState(false);
  const [userAddress, setUserAddress] = useState();
  const router = useRouter();
  const [cart] = useAtom(cartAtom);
  const { session } = useAuth();
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  // total quantity (not number of products, but total items)
  const totalItems = cart.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    const fetchAddress = async () => {
      const userRealAddress = await GetLocation(session.user.id);
      console.log("I got the real user address:", userRealAddress);
      setUserAddress(userRealAddress);
    };

    fetchAddress();
  }, []);

  const logOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* status bar */}
        <StatusBar backgroundColor="#FFDBB4" barStyle="dark-content" />

        {/* modal component */}
        {isModalon && (
          <ConfirmModal
            visible={isModalon}
            title="Do you want to change your address?"
            subtitle={userAddress}
            onCancel={() => setIsModalOn(false)}
            onConfirm={() => {
              setIsModalOn(false);
              setTimeout(() => {
                router.push("/MapScreen");
              }, 150);
            }}
          />
        )}

        <LinearGradient
          colors={[
            "#FFDBB4",
            "#FFE6CC",
            "#FFE6CC",
            "#FFEFD6",
            "#FFF5EB",
            "#FFFFFF",
          ]}
          start={{ x: 0.5, y: 0 }} // Force start at the very top
          end={{ x: 0.5, y: 1 }}
          // Exactly bottom center
          style={styles.gradient}
        >
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {/* page Header */}
            <View style={styles.header}>
              {/* Left Side - Delivery Location */}
              <View style={styles.locationContainer}>
                <View style={styles.locationRow}>
                  <TouchableOpacity
                    style={styles.circleIcon}
                    activeOpacity={1}
                    onPress={() => {
                      setIsModalOn(true);
                    }}
                  >
                    <Ionicons name="location-sharp" size={22} color="#FF6B00" />
                  </TouchableOpacity>
                  <View style={{ marginLeft: 8, flex: 1, overflow: "hidden" }}>
                    <Text style={styles.deliveryText}>Delivery to</Text>
                    <Text
                      style={styles.addressText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {userAddress}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Side - Icons */}
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    logOut();
                  }}
                >
                  <View style={styles.circleIcon}>
                    <FontAwesome5 name="bell" size={24} color="#333" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.push("/carts")}
                >
                  <View style={styles.iconContainer}>
                    <FontAwesome5
                      name="shopping-cart"
                      size={24} // Slightly larger icon
                      color="#FF6B00"
                    />

                    {totalItems > 0 && (
                      <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalItems}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() =>      router.push("/FilterSearchProducts")} 
              activeOpacity={1}
            >
              <View style={styles.searchBar}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="rgba(0,0,0,0.4)"
                />

                {/* Use Text instead of TextInput so it doesn't try to open the keyboard */}
                <Text style={[styles.input, { color: "rgba(0,0,0,0.4)" }]}>
                  Search restaurants, food...
                </Text>

                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowSearchOptions(true)}
                >
                  <Feather name="sliders" size={18} color="#FF6B00" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* horizontal features */}
            <View style={{ flex: 1, marginTop: 10 }}>
              <RenderingFeaturesCategories data={featuredCategoriesData} />
            </View>

            {/* Rendering vendors */}
            <View style={{ flex: 1, marginTop: 10, marginBottom: 100 }}>
              <RenderingVendors />
            </View>

            {/* filter search modal */}
            <Modal
              visible={showSearchOptions}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowSearchOptions(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowSearchOptions(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    What are you looking for?
                  </Text>

                  <View style={styles.optionRow}>
                    {/* Option 1: Products */}
                    <TouchableOpacity
                      style={styles.optionCard}
                      onPress={() => {
                        setShowSearchOptions(false);
                        router.push("/FilterSearchProducts"); // Navigate to your product page
                      }}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: "#FFF0E6" },
                        ]}
                      >
                        <Ionicons name="fast-food" size={28} color="#FF6B00" />
                      </View>
                      <Text style={styles.optionText}>Products</Text>
                    </TouchableOpacity>

                    {/* Option 2: Vendors/Restaurants */}
                    <TouchableOpacity
                      style={styles.optionCard}
                      onPress={() => {
                        setShowSearchOptions(false);
                        router.push("../FilterSearchVendors"); // Navigate to your vendor page
                      }}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          { backgroundColor: "#E6F7FF" },
                        ]}
                      >
                        <FontAwesome5 name="store" size={24} color="#0095FF" />
                      </View>
                      <Text style={styles.optionText}>Vendors</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 15, // Good space from top (SafeArea handles notch)
    paddingBottom: 20,
  },
  locationContainer: {
    flex: 1, // Takes available space
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    fontFamily: "Poppins-Black",
  },
  addressText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginTop: 2,
    fontFamily: "Poppins-SemiBold",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 9,
  },
  iconButton: {
    padding: 10,
    marginLeft: 1, // Space between icons
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 52,

    // soft premium shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: "#333",
    marginLeft: 10,
  },

  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFF3E8",
    justifyContent: "center",
    alignItems: "center",
  },
  circleIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#fff", // Or your theme color
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    // Important: No overflow hidden here or the badge will be cut off!
  },

  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#F5F5F5", // Light background to make the orange/red pop
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    // Move it further to the corner
    top: 2,
    right: 2,
    backgroundColor: "#FF3B30",
    // Increased size for visibility
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    // Thicker white border makes it look "elevated"
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    // Add a small shadow for depth
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 11, // Larger text
    fontWeight: "900", // Extra bold
    lineHeight: 14, // Centers text vertically better on some devices
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dim the background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D2D2D",
    marginBottom: 25,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  optionCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D2D2D",
  },
});
