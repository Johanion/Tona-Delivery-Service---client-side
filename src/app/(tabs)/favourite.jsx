import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import FavouriteList from "../../components/FavouriteList";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../providers/AuthProvider";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const favourite = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const { session } = useAuth();

  // 1. Unified lowercase keys for Routes
  const [routes] = useState([
    { key: "products", title: "Products" },
    { key: "orders", title: "Orders" },
  ]);

  const fetchFavourites = async () => {
    const { data, error } = await supabase
      .from("favourites")
      .select(
        `
        product_id, products(*),

        order_id, orders(*)
      `,
      )

    if (error) throw error;
    return data || [];
  };

  const { data: allFavouritesData = [], isLoading } = useQuery({
    queryKey: ["fetchFavourites", session?.user?.id],
    queryFn: fetchFavourites,
    enabled: !!session?.user?.id,
    refetchInterval: 5000, // Fetch every 10 seconds
    // Optional: only fetch if the user is actually looking at the screen
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  console.log("all favoirte data", allFavouritesData)

  // 2. Memoize the filtered data to prevent unnecessary re-renders of the tabs
  const filteredLists = useMemo(() => {
    return {
      products: allFavouritesData
        .filter((item) => item.products)
        .map((item) => item.products),
      orders: allFavouritesData
        .filter((item) => item.orders)
        .map((item) => item.orders),
    };
  }, [allFavouritesData]);

  // 3. Define the scenes using the memoized data
  // Replace your SceneMap block with this:
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "products":
        return <FavouriteList data={filteredLists.products} type="products" />;
      case "orders":
        return <FavouriteList data={filteredLists.orders} type="orders" />;
      default:
        return null;
    }
  };

  const FavoriteHeader = () => {
    return (
      <View style={styles.Fcontainer}>
        {/* 1. Artistic Mesh Background */}
        <LinearGradient
          colors={["#FF416C", "#FF4B2B", "#FF8C00"]} // Deep pink to Tona Orange
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.meshBg}
        >
          {/* Floating Abstract Shapes for Depth */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </LinearGradient>

        {/* 2. Floating Glass Card */}
        <View style={styles.contentWrapper}>
          <BlurView
            intensity={Platform.OS === "ios" ? 30 : 100}
            tint="light"
            style={styles.glassCard}
          >
            <View style={styles.topRow}>
              <View style={styles.badge}>
              </View>
            </View>

            <View style={styles.titleSection}>
              <View style={styles.titleBadge}>
                <Ionicons name="sparkles" size={14} color="#FFF4D6" />
                <Text style={styles.titleBadgeText}>Saved with care</Text>
              </View>

              <View style={styles.titleRow}>
                <View style={styles.titleTextBlock}>
                  <Text style={styles.mainTitle}>Favourite</Text>
                  <Text style={styles.subTitle}>Collection</Text>
                </View>

                <View style={styles.heartBubble}>
                  <Ionicons
                    name="heart"
                    size={26}
                    color="#FFF"
                    style={styles.heartIcon}
                  />
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      labelStyle={styles.label}
      activeColor="#FF3B5C"
      inactiveColor="#666"
      pressColor="transparent"
    />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <FavoriteHeader />

        <View style={styles.container}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            lazy // Only load the active tab's list for better performance
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  headerContainer: {
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 14, color: "#999", fontWeight: "500" },
  adminName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  rightIcons: { flexDirection: "row", gap: 12 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B5C",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  tabbar: {
    backgroundColor: "#FFF",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  indicator: { backgroundColor: "#FF3B5C", height: 3, borderRadius: 3 },
  label: { fontWeight: "700", fontSize: 13, textTransform: "none" },
  Fcontainer: {
    height: 220,
    backgroundColor: "#FFF",
  },
  meshBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    top: -50,
    right: -30,
  },
  circle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -20,
    left: -20,
  },
  contentWrapper: {
    paddingTop: 14,
    paddingHorizontal: 25,
  },
  glassCard: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  titleSection: {
    gap: 10,
  },
  titleBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  titleBadgeText: {
    color: "#FFF8EF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  titleTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.78)",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  heartBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  heartIcon: {
    textShadowColor: "rgba(0, 0, 0, 0.16)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
});

export default favourite;
