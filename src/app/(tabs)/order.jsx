import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { selectedOrderItems } from "../../atom";
import { supabase } from "../../lib/supabase";
import { insertPostFavouriteOrder } from "../../services/PostService";
import { deletePostFavouriteOrder } from "../../services/DeleteService";
import VendorCardSkelton from "../../skeleton/VendorCardSkelton";
import ErrorState from "../../components/ErrorState";

const OrderList = () => {
  const router = useRouter();
  const setOrderItems = useSetAtom(selectedOrderItems);
  const { session } = useAuth();

  // get all orders detail and history
  const fetchUserOrders = async (userId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      id,
      created_at,
      total_price,
      is_verified,
      is_picked_up,
      is_dropped_off,
      order_delivered,
      "orders_products" (
        quantity,
        product_id,
        products (
          product_name,
          price,
          image,
          vendors (
          name, 
          image
          )
        )
      )
    `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.log(error.message);
    return data;
  };

  // TanStack Query Hook
  const {
    data: orders_history_data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ordersHistory"],
    queryFn: () => fetchUserOrders(session.user.id),
    enabled: !!session?.user?.id,
    refetchInterval: 5000, // Fetch every 10 seconds
    // Optional: only fetch if the user is actually looking at the screen
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const fetchFavouriteOrderIds = async (userId) => {
    const { data, error } = await supabase
      .from("favourites")
      .select("order_id")
      .eq("user_id", userId)
      .not("order_id", "is", null);

    if (error) throw error;
    return data?.map((item) => item.order_id) || [];
  };

  const { data: favouriteOrderIds = [], refetch: refetchFavouriteOrders } =
    useQuery({
      queryKey: ["favouriteOrders", session?.user?.id],
      queryFn: () => fetchFavouriteOrderIds(session.user.id),
      enabled: !!session?.user?.id,
    });

  if (isLoading) {
    return <VendorCardSkelton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Fetch Failed"
        onRetry={refetch} // Passes the refetch function
      />
    );
  }
  // handling orders onPress
  const handleOrderPress = (orderItem) => {
    setOrderItems(orderItem);
    router.push("/orderDetails");
  };

  // handling favourite per order
  const handleFavourite = async (orderItem) => {
    try {
      if (favouriteOrderIds.includes(orderItem.id)) {
        await deletePostFavouriteOrder(session.user.id, orderItem.id);
        await refetchFavouriteOrders();
        return;
      }
      await insertPostFavouriteOrder(session.user.id, orderItem.id);
      await refetchFavouriteOrders();
    } catch (error) {
      console.error("Error adding favorite:", error.message);
    }
  };

  const renderOrderItem = ({ item }) => {
    // get status of the order
    const getStatusText = (order) => {
      if (order.is_dropped_off) return "Delivered";
      if (order.is_picked_up) return "On the Way";
      if (order.is_verfied_up) return "Verified";
      return "Pending";
    };

    // 1. Calculate progress based on your DB flags
    const calculateProgress = () => {
      if (item.is_dropped_off) return "100%";
      if (item.is_picked_up) return "66.66%";
      if (item.is_verified) return "33.33%"; // Corrected from your DB log (is_verified)
      return "10%";
    };

    const progress = calculateProgress();
    const isFavourite = favouriteOrderIds.includes(item.id);

    // 2. Format the product summary (e.g., "Chicken Bucket + 2 more")
    const firstProductName =
      item.orders_products?.[0]?.products?.product_name || "Food Order";
    const extraItemsCount = item.orders_products?.length - 1;
    const orderSummary =
      extraItemsCount > 0
        ? `${firstProductName} + ${extraItemsCount} more`
        : firstProductName;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.orderCard}
        // Pass the whole item as a stringified param or just the ID
        onPress={() => handleOrderPress(item)}
      >
        <View style={styles.cardTop}>
          {/* date section with calendar icon */}
          <View style={styles.dateBadge}>
            <Feather
              name="calendar"
              size={12}
              color="#A39495"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* favourite section with heart icon  */}
          <View style={styles.dateBadge}>
            <TouchableOpacity
              onPress={() => {
                handleFavourite(item);
              }}
            >
              <MaterialCommunityIcons
                name={isFavourite ? "heart" : "heart-outline"}
                size={19}
                color={isFavourite ? "#FF3B5C" : "#A39495"}
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            {/* Dynamic icon based on status */}
            <MaterialCommunityIcons
              name={
                item.is_dropped_off
                  ? "package-variant"
                  : "truck-delivery-outline"
              }
              size={24}
              color="#FF3B5C"
            />
          </View>
          <View style={styles.textDetails}>
            <Text style={styles.orderTitle} numberOfLines={1}>
              {orderSummary}
            </Text>
            <View style={styles.priceTagRow}>
              <View style={styles.birrBadge}>
                {" "}
                <Text style={styles.totalAmountText}>
                  Birr {item.total_price}
                </Text>
              </View>

              <View style={styles.dotSeparator} />
              <Text style={styles.statusText}>{getStatusText(item)}</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </View>

        {/* --- REFINED PROGRESS SECTION --- */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={["#FF4B68", "#FF3B5C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: progress }]}
            />
          </View>

          <View style={styles.stepsRow}>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepLabel,
                  item.is_verified && styles.activeStep,
                ]}
              >
                Verified
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepLabel,
                  item.is_picked_up && styles.activeStep,
                ]}
              >
                Picked Up
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepLabel,
                  item.is_dropped_off && styles.activeStep,
                ]}
              >
                Delivered
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient
          colors={["#FFDBB4", "#FFF5EB", "#FFFFFF"]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Order History</Text>
              <Text style={styles.headerSub}>Track your recent cravings</Text>
            </View>
          </View>

          <FlatList
            data={orders_history_data}
            keyExtractor={(item) => item.id}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  gradient: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: "900", color: "#1A1A1A" },
  headerSub: { fontSize: 13, color: "#666", fontWeight: "500" },
  listPadding: { padding: 20, paddingBottom: 100 },

  // Order Card Styles
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#FF3B5C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: { fontSize: 12, color: "#3D3334", fontWeight: "600" },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F6", // Very light grey
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 11,
    alignSelf: "flex-end",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFF0F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textDetails: { flex: 1 },
  orderTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
  statusText: {
    fontSize: 13,
    color: "#FF3B5C",
    fontWeight: "700",
    marginTop: 2,
  },

  // Progress Bar Styles
  progressSection: {
    marginTop: 10,
    backgroundColor: "#FAFBFD",
    padding: 12,
    borderRadius: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepLabel: {
    fontSize: 10,
    color: "#BBB",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  activeStep: {
    color: "#1A1A1A",
  },

  idBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  birrBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 0.5,
  },
  priceTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginTop: 10,
  },
  totalAmountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    marginHorizontal: 8,
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
  },
  // Ensure the first step aligns left and last aligns right
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
});

export default OrderList;
