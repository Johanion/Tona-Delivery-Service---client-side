import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Feather } from "@expo/vector-icons";

import { supabase } from "../../lib/supabase";
import { VendorId } from "../../atom";
import { VendorName } from "../../atom";
import { cartAtom, addToCartAtom, removeFromCartAtom } from "../../atom";

import VendorCardSkelton from "../../skeleton/VendorCardSkelton.jsx";
import ErrorState from "../../components/ErrorState.jsx";

const FoodOrder = () => {
  const [cart] = useAtom(cartAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [vendorId] = useAtom(VendorId);
  const [vendorName] = useAtom(VendorName);

  const { width } = Dimensions.get("window");
  const router = useRouter();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.amount * item.price,
    0,
  );

  // calling supabase to fetch products
  const fetchProductsByVendors = async (vId) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", vId); // Let the database do the filtering

    if (error) throw new Error(error.message);
    return data;
  };

  // TanStack Query Hook
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProductsByVendors(vendorId),
    enabled: !!vendorId, // Only run if we have an ID
  });

  if (error) {
    return (
      <ErrorState
        title="Fetch Failed"
        onRetry={refetch} // Passes the refetch function
      />
    );
  }

  if (isLoading) {
    return <VendorCardSkelton />;
  }

  // get producsts for specific (vendorId)
  // const products = productsData.filter(
  //   (item) => item.vendor_id == vendorId,
  // );
  console.log(vendorId);

  const getQuantity = (productId) => {
    const item = cart.find((p) => p.id === productId);
    return item ? item.amount : 0;
  };

  const renderItem = ({ item }) => {
    const quantity = getQuantity(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Enhanced Image Section */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.foodImage} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.05)"]}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* Detailed Info Section */}
          <View style={styles.infoWrapper}>
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.categoryLabel}>{vendorName}</Text>
                <View style={styles.ratingBadge}>
                  <Feather name="star" size={10} color="#FFB800" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>

              <Text style={styles.foodTitle} numberOfLines={1}>
                {item.product_name}
              </Text>
              <Text style={styles.foodDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            <View style={styles.priceActionRow}>
              <Text style={styles.priceText}>
                <Text style={styles.currencySymbol}>Birr </Text>
                {item.price}
              </Text>

              {quantity === 0 ? (
                <TouchableOpacity
                  onPress={() => addToCart(item)}
                  activeOpacity={0.7}
                  style={styles.addButton}
                >
                  <Feather name="plus" size={18} color="#FFF" />
                </TouchableOpacity>
              ) : (
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Feather name="minus" size={14} color="#121212" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Feather name="plus" size={14} color="#121212" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Good afternoon 👋</Text>
            <Text style={styles.brandTitle}>
              Deliciously <Text style={styles.accentText}>Yours</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={22} color="#121212" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {cart.length > 0 && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.checkoutBar}
            onPress={() => router.push("../carts")}
          >
            <View style={styles.checkoutLeft}>
              <View style={styles.cartIconWrapper}>
                <Feather name="shopping-bag" size={20} color="#FFF" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.length}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.totalLabel}>Total Price</Text>
                <Text style={styles.totalValue}>
                  Birr {totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.checkoutBtn}>
              <Text style={styles.checkoutBtnText}>Checkout</Text>
              <Feather name="arrow-right" size={18} color="#FF4B68" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FB" },

  // Header Style
  header: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
  },
  brandTitle: { fontSize: 24, fontWeight: "800", color: "#121212" },
  accentText: { color: "#FF4B68" },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F8F9FB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },

  // Card Styling
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginBottom: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  cardContent: { flexDirection: "row", flex: 1 },
  imageContainer: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  foodImage: { width: 100, height: 100 },

  infoWrapper: { flex: 1, marginLeft: 16, justifyContent: "space-between" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FF4B68",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFB800",
    marginLeft: 3,
  },

  foodTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#121212",
    marginTop: 2,
  },
  foodDescription: {
    fontSize: 12,
    color: "#7C7C7C",
    marginTop: 4,
    lineHeight: 16,
  },

  priceActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceText: { fontSize: 16, fontWeight: "800", color: "#121212" },
  currencySymbol: { fontSize: 12, color: "#FF4B68" },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    borderRadius: 12,
    padding: 4,
  },
  counterBtn: {
    width: 28,
    height: 28,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  counterValue: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#121212",
  },

  // Floating Bar
  footerContainer: {
    position: "absolute",
    bottom: 34,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  checkoutBar: {
    width: "100%",
    backgroundColor: "#121212",
    borderRadius: 22,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  checkoutLeft: { flexDirection: "row", alignItems: "center" },
  cartIconWrapper: {
    position: "relative",
    marginRight: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 15,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF4B68",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#121212",
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
  totalLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "600",
  },
  totalValue: { color: "#FFF", fontSize: 17, fontWeight: "800" },
  checkoutBtn: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  checkoutBtnText: {
    color: "#121212",
    fontWeight: "800",
    marginRight: 6,
    fontSize: 14,
  },
});

export default FoodOrder;
