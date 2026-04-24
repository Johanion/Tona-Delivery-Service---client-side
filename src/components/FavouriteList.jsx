import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { selectedOrderAtom } from "../atom";
import { selectedOrderItems } from "../atom";


const TYPE_META = {
  products: {
    label: "Product",
    icon: "fast-food-outline",
    iconColor: "#C95C1A",
    iconBg: "#FFF1E7",
    cta: "See item",
    route: ""
  },
  vendors: {
    label: "Vendor",
    icon: "storefront-outline",
    iconColor: "#A84A00",
    iconBg: "#FFF3E2",
    cta: "Open store",
    route: ""
  },
  orders: {
    label: "Order",
    icon: "receipt-outline",
    iconColor: "#0E8A72",
    iconBg: "#E9FBF6",
    cta: "View order",
    route: ""
  },
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "Price unavailable";
  return `${value} ETB`;
};

const formatDate = (value) => {
  if (!value) return "Recent favourite";
  return new Date(value).toLocaleDateString();
};

const FavouriteList = ({ data, type }) => {
  const router = useRouter();
  const setOrderAtom = useSetAtom(selectedOrderAtom);
  const meta = TYPE_META[type] || TYPE_META.products;
  const setOrderItems = useSetAtom(selectedOrderItems);


  const handlePress = (item) => {
    if (type === "orders") {
        setOrderItems(item);
    router.push("/orderDetails");
    }
  };

  const getTitle = (item) => {
    if (type === "vendors") return item.brand_name || item.name || "Unnamed vendor";
    if (type === "orders") return `Order #${item.id?.slice(0, 3).toUpperCase() || "00000000"}`;
    return item.product_name || "Unnamed product";
  };

  const getSubtitle = (item) => {
    if (type === "orders") return item.status || "Completed";
    if (type === "products") return item.description || "No description available";
  };


  const renderVisual = (item) => {
    if (type === "products") {
      return (
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150",
          }}
          style={styles.imageThumb}
        />
      );
    }

    if (type === "vendors") {
      return (
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150",
          }}
          style={styles.imageThumb}
        />
      );
    }

    return (
      <View style={[styles.iconShell, { backgroundColor: meta.iconBg }]}>
        <Ionicons name={meta.icon} size={24} color={meta.iconColor} />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => handlePress(item)}
    >
      <View style={styles.cardGlow} />

      <View style={styles.cardBody}>
        {renderVisual(item)}

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {getTitle(item)}
          </Text>

          <Text style={styles.subtitle} numberOfLines={2}>
            {getSubtitle(item)}
          </Text>


        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listPadding}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Feather name="heart" size={34} color="#D8A38C" />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>Your favourite {type} will appear here.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listPadding: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 120,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFDF9",
    borderRadius: 26,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F6E7DA",
    overflow: "hidden",
    shadowColor: "#D98B5D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  cardGlow: {
    position: "absolute",
    top: -20,
    right: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFF0E4",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FCEEE2",
    borderWidth: 1,
    borderColor: "#F4DAC9",
  },
  typePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B65D33",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageThumb: {
    width: 82,
    height: 82,
    borderRadius: 22,
    backgroundColor: "#F7F1EB",
  },
  iconShell: {
    width: 82,
    height: 82,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#23160F",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: "#7A6558",
  },
  metaRow: {
    marginTop: 10,
  },
  metaBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FFF5EC",
    borderWidth: 1,
    borderColor: "#F3E1D3",
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C5653E",
  },
  footerRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  secondaryText: {
    flex: 1,
    fontSize: 12,
    color: "#8A7568",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F4E4D8",
  },
  ctaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#47311F",
  },
  emptyContainer: {
    marginTop: 96,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIconWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFF2E8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F7DECF",
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "800",
    color: "#35231A",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#8B776A",
    textAlign: "center",
  },
});

export default FavouriteList;
