import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { selectedOrderAtom } from "../atom";

const { width } = Dimensions.get("window");

const FavouriteList = ({ data, type }) => {
  const router = useRouter();
  const setOrderAtoms = useSetAtom(selectedOrderAtom);

  const renderItem = ({ item }) => {
    // --- 1. PRODUCT LAYOUT ---
    if (type === "products") {
      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/product-details",
              params: { id: item.id },
            })
          }
        >
          <View style={styles.row}>
            <Image
              source={{
                uri: item.image_url || "https://via.placeholder.com/150",
              }}
              style={styles.imageThumb}
            />
            <View style={styles.mainContent}>
              <Text style={styles.titleText} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.descriptionText} numberOfLines={1}>
                {item.description || "No description available"}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{item.price} ETB</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Meal</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // --- 2. VENDOR LAYOUT ---
    if (type === "vendors") {
      return (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/vendor-details",
              params: { id: item.id },
            })
          }
        >
          <View style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF4E5" }]}>
              <MaterialCommunityIcons
                name="storefront"
                size={24}
                color="#FF9800"
              />
            </View>
            <View style={styles.mainContent}>
              <Text style={styles.titleText}>
                {item.brand_name || item.name}
              </Text>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={12} color="#999" />
                <Text style={styles.subText}>
                  {" "}
                  {item.location || "Addis Ababa"}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </View>
        </TouchableOpacity>
      );
    }

    // --- 3. ORDER LAYOUT (Historical/Favorite Orders) ---
    if (type === "orders") {
      return (
        <TouchableOpacity
          style={styles.orderCard}
          activeOpacity={0.9}
          onPress={() => {
            setOrderAtoms(item);
            router.push("../verify-assign-orders");
          }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>
                #{item.id.slice(0, 8).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.timeText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.orderBody}>
            <View style={styles.orderIcon}>
              <MaterialCommunityIcons
                name="package-variant"
                size={24}
                color="#4CAF50"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceText}>
                Total: {item.total_price} ETB
              </Text>
              <Text style={styles.subText}>
                Status: {item.status || "Completed"}
              </Text>
            </View>
            <TouchableOpacity style={styles.reorderBtn}>
              <Text style={styles.reorderText}>View</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listPadding}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={50} color="#DDD" />
          <Text style={styles.emptyText}>No favorite {type} yet</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listPadding: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  row: { flexDirection: "row", alignItems: "center" },
  imageThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  mainContent: { flex: 1, marginLeft: 12 },
  titleText: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  descriptionText: { fontSize: 12, color: "#888", marginTop: 2 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  priceText: { fontSize: 15, fontWeight: "800", color: "#239BA7" },
  tag: {
    backgroundColor: "#FF3B5C15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    color: "#FF3B5C",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  subText: { fontSize: 13, color: "#666" },
  // Order Specific
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  idText: { fontSize: 11, fontWeight: "800", color: "#666" },
  timeText: { fontSize: 12, color: "#999" },
  orderBody: { flexDirection: "row", alignItems: "center" },
  orderIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reorderBtn: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  reorderText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  emptyContainer: { marginTop: 100, alignItems: "center" },
  emptyText: { marginTop: 10, color: "#BBB", fontSize: 16 },
});

export default FavouriteList;
