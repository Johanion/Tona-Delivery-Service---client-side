import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import RenderingFeaturesCategories from "../../components/RenderingFeaturesCategories.jsx";
import featuredCategoriesData from "../../constants/featuredCategoriesData.js";

const index = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>

        {/* status bar */}
          <StatusBar
            backgroundColor= "#FFDBB4"
            barStyle="dark-content"
          />

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
          {/* page Header */}
          <View style={styles.header}>
            {/* Left Side - Delivery Location */}
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <View style={styles.circleIcon}>
                  <Ionicons name="location-sharp" size={22} color="#FF6B00" />
                </View>
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.deliveryText}>Delivery to</Text>
                  <Text style={styles.addressText}>Home • New York</Text>
                </View>
              </View>
            </View>

            {/* Right Side - Icons */}
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <View style={styles.circleIcon}>
                  <FontAwesome5 name="bell" size={24} color="#333" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <View style={styles.circleIcon}>
                  <FontAwesome5
                    name="shopping-cart"
                    size={22}
                    color="#FF6B00"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* horizontal features */}
          <View style={{  flex:1, marginTop: 30 }}>
            <RenderingFeaturesCategories data={featuredCategoriesData} />
          </View>

          {/* You can add more content below the header here */}
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
});
