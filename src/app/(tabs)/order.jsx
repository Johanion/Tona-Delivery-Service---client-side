import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Mock Data from your request
const orders = [
  {
    id: "o1",
    date: "12 Oct, 2023",
    products: [
      {
        id: "p2",
        product_name: "Chicken Bucket",
        restaurant_id: "r2",
        description: "Crispy fried chicken with signature spices.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
        price: 100,
        delivery_time: "40",
        restaurant_id: "v1",
        quantity: 4,
      },
    ],
    description: "2 Items from Burger House",
    is_verfied_up: true,
    is_picked_up: true,
    is_dropped_off: false,
    order_delivered: false,
  },
  {
    id: "o2",
    date: "10 Oct, 2023",
    products: [
      {
        id: "p2",
        product_name: "Chicken Bucket",
        restaurant_id: "r2",
        description: "Crispy fried chicken with signature spices.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
        price: 100,
        delivery_time: "40",
        restaurant_id: "v1",
        quantity: 4,
      },
      {
        id: "p2",
        product_name: "Chicken Bucket",
        restaurant_id: "r2",
        description: "Crispy fried chicken with signature spices.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
        price: 100,
        delivery_time: "40",
        restaurant_id: "v1",
        quantity: 4,
      },
    ],
    description: "1 Item from Pizza Palace",
    is_verfied_up: true,
    is_picked_up: false,
    is_dropped_off: false,
    order_delivered: false,
  },
];

const OrderList = () => {
  const router = useRouter();

  const calculateProgress = (order) => {
    if (order.is_dropped_off) return "100%";
    if (order.is_picked_up) return "66.66%";
    if (order.is_verfied_up) return "33.33%";
    return "5%"; // Initial state
  };

  const getStatusText = (order) => {
    if (order.is_dropped_off) return "Delivered";
    if (order.is_picked_up) return "On the Way";
    if (order.is_verfied_up) return "Verified";
    return "Pending";
  };

  const renderOrderItem = ({ item }) => {
    const progress = calculateProgress(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.orderCard}
        onPress={() => router.push("/orderDetails")}
      >
        <View style={styles.cardTop}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{item.id.toUpperCase()}</Text>
          </View>
          <Text style={styles.dateText}>{item.date || "Just Now"}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={24}
              color="#FF3B5C"
            />
          </View>
          <View style={styles.textDetails}>
            <Text style={styles.orderTitle}>
              {item.description || "Food Order"}
            </Text>
            <Text style={styles.statusText}>{getStatusText(item)}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </View>

        {/* --- CREATIVE PROGRESS SECTION --- */}
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
            <Text
              style={[
                styles.stepLabel,
                item.is_verfied_up && styles.activeStep,
              ]}
            >
              Verified
            </Text>
            <Text
              style={[styles.stepLabel, item.is_picked_up && styles.activeStep]}
            >
              Picked Up
            </Text>
            <Text
              style={[
                styles.stepLabel,
                item.is_dropped_off && styles.activeStep,
              ]}
            >
              Dropped
            </Text>
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
            data={orders}
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
  idBadge: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  idText: { fontSize: 11, fontWeight: "800", color: "#777" },
  dateText: { fontSize: 12, color: "#999", fontWeight: "600" },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
});

export default OrderList;
