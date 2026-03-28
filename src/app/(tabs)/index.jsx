import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";

import RenderingFeaturesCategories from "../../components/RenderingFeaturesCategories.jsx";
import featuredCategoriesData from "../../constants/featuredCategoriesData.js";
import RenderingRestaurants from "../../components/RenderingRestaurants.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx"

const index = () => {
  const [isModalon, setIsModalOn] = useState(false)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* status bar */}
        <StatusBar backgroundColor="#FFDBB4" barStyle="dark-content" />

        {/* modal component */}
        {isModalon && (
           <ConfirmModal 
             visible= {isModalon} 
             title ="Do you want to change your adress?" 
             subtitle="Home . New York" 
             onCancel={()=>setIsModalOn(false)} 
             onConfirm = {()=>{console.log("so you want to change your adress")}}/> )}

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
        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator= {false}>

          {/* page Header */}
          <View style={styles.header}>
            {/* Left Side - Delivery Location */}
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <TouchableOpacity style={styles.circleIcon} activeOpacity={1} onPress={()=>{setIsModalOn(true)}}>
                  <Ionicons name="location-sharp" size={22} color="#FF6B00" />
                </TouchableOpacity>
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

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={20}
                color="rgba(0,0,0,0.4)"
              />

              <TextInput
                placeholder="Search restaurants, food, hotels..."
                placeholderTextColor="rgba(0,0,0,0.4)"
                style={styles.input}
              />

              <TouchableOpacity style={styles.filterButton}>
                <Feather name="sliders" size={18} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>

          {/* horizontal features */}
          <View style={{ flex: 1, marginTop: 10 }}>
            <RenderingFeaturesCategories data={featuredCategoriesData} />
          </View>

          {/* Rendering restaurants */}
          <View style={{ flex: 1, marginTop: 10, marginBottom: 100 }}>
            <RenderingRestaurants />
          </View>
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
});
