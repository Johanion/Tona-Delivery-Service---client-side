import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

const ProfileScreen = () => {
  const router = useRouter();
  const { session } = useAuth();

  //  Fetching Addresses with your Logic ---
  const fetchUserLocations = async () => {
    const { data, error } = await supabase
      .from("address_profile")
      .select(
        `
        id,
        label,
        is_default,
        address:address_id (
          id,
          latitude,
          longitude,
          address
        )
      `,
      )
      .eq("user_id", session?.user?.id);

    if (error) throw error;
    return data || [];
  };

  const { data: userLocationsData, isLoading: isAddrLoading } = useQuery({
    queryKey: ["userLocations", session?.user?.id],
    queryFn: fetchUserLocations,
    refetchInterval: 3000,
    enabled: !!session?.user?.id,
  });

  // Extracting default address safely
  const defaultLocation = userLocationsData?.find(
    (item) => item.is_default === true,
  );
  const activeAddress = defaultLocation?.address?.address || "No address set";
  const addressLabel = defaultLocation?.label || "Location";
  if (isAddrLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  async function handleSignOut() {
    // Always destructure the error
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const { error: LogOutError } = await supabase.auth.signOut();
          if (LogOutError) {
            throw Error(LogOutError);
          }
          router.replace("../log-in");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Header Section: Orange Gradient Mesh --- */}
        <LinearGradient
          colors={["#FF8C00", "#FF4500", "#D35400"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.glassButton}>
              <Feather name="settings" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={["#FFF", "#FFE0B2"]}
                style={styles.avatarCircle}
              >
                {/* <Text style={styles.avatarInitial}>{userProfileData.name}</Text> */}
              </LinearGradient>
              <View style={styles.editBadge}>
                <Feather name="camera" size={12} color="#FFF" />
              </View>
            </View>
            {/* <Text style={styles.userName}>{userProfileData.phone_number}</Text> */}
          </View>

          {/* Floating Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </LinearGradient>

        {/* --- Content Section --- */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Active Address</Text>
          <View style={styles.addressCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF3E0" }]}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={24}
                color="#FF8C00"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelTag}>{addressLabel}</Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {activeAddress}
              </Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Account Menu</Text>
          <View style={styles.menuList}>
            <MenuOption icon="heart" title="My Favorites" color="#FF3B5C" />
            <MenuOption icon="credit-card" title="Payments" color="#4CAF50" />
            <MenuOption icon="bell" title="Notifications" color="#2196F3" />
            <MenuOption icon="shield" title="Security" color="#673AB7" />
          </View>

          <TouchableOpacity style={styles.logoutRow} onPress={handleSignOut}>
            <View style={styles.logoutIcon}>
              <Feather name="log-out" size={20} color="#FF4500" />
            </View>
            <Text style={styles.logoutText}>Sign Out of Tona</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Tona App v1.2.0 • AAiT Developer</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuOption = ({ icon, title, color }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={[styles.menuIconBox, { backgroundColor: `${color}15` }]}>
      <Feather name={icon} size={18} color={color} />
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
    <Feather name="chevron-right" size={16} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: { alignItems: "center" },
  avatarWrapper: { position: "relative", marginBottom: 15 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarInitial: { fontSize: 40, fontWeight: "900", color: "#FF8C00" },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#1A1A1A",
    padding: 6,
    borderRadius: 12,
  },
  userName: { fontSize: 26, fontWeight: "800", color: "#FFF" },
  userSub: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  statsBar: {
    position: "absolute",
    bottom: -30,
    left: 40,
    right: 40,
    backgroundColor: "#FFF",
    borderRadius: 20,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  statLabel: { fontSize: 12, color: "#999" },
  divider: { width: 1, height: 30, backgroundColor: "#EEE" },
  content: { marginTop: 50, paddingHorizontal: 25 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 25,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDFDFD",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  labelTag: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF8C00",
    marginBottom: 2,
  },
  addressText: { fontSize: 14, color: "#444", fontWeight: "600" },
  changeBtn: { padding: 8 },
  changeBtnText: { color: "#FF8C00", fontWeight: "700", fontSize: 13 },
  menuList: { backgroundColor: "#FDFDFD", borderRadius: 24, padding: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTitle: { flex: 1, fontSize: 15, fontWeight: "700", color: "#333" },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#FFF5F5",
    padding: 15,
    borderRadius: 20,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#FF4500" },
  version: {
    textAlign: "center",
    color: "#CCC",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 11,
  },
});

export default ProfileScreen;
