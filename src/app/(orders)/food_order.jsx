import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { useRouter } from "expo-router";

import products from "../../constants/foods"; // your products array
import { cartAtom, addToCartAtom, removeFromCartAtom } from "../../atom";

const FoodOrder = () => {
  const [cart] = useAtom(cartAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.amount * item.price,
    0,
  );
  const router = useRouter()

  const getQuantity = (productId) => {
    const item = cart.find((p) => p.id === productId);
    return item ? item.amount : 0;
  };

  console.log(totalPrice);
  console.log(
    "cart lengthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh.",
    cart.length,
  );

  const renderItem = ({ item }) => {
    const quantity = getQuantity(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.restaurant}>{item.name}</Text>
          <Text style={styles.productName}>{item.product_name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.bottomRow}>
            {quantity === 0 ? (
              <LinearGradient
                colors={["#ff6b81", "#ff3b5c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButton}
              >
                <TouchableOpacity onPress={() => addToCart(item)}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <LinearGradient
          colors={["#FFF5EB", "#FFEFD6", "#FFE6CC", "#FFDBB4"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Order Your Favorites</Text>
            <Text style={styles.headerSubtitle}>
              Delicious meals at your fingertips
            </Text>
          </View>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* checkout to payment */}
            <LinearGradient
              colors={["#ff6b81", "#ff3b5c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.checkoutContainer}
            >
              <Text style={styles.totalText}>Total: ${totalPrice}</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={()=>{router.push("./")}}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </LinearGradient>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default FoodOrder;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111" },
  headerSubtitle: { fontSize: 15, color: "#666", marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  // ← New wrapper with fixed height
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "100%",
    height: 160, // same as before
    backgroundColor: "white",
  },
  image: { width: "100%", height: "100%", borderRadius: 20 },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff3b5c",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontWeight: "700" },
  info: { padding: 16 },
  restaurant: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ff3b5c",
    marginBottom: 4,
  },
  productName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
    lineHeight: 24,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  bottomRow: { flexDirection: "row", justifyContent: "flex-end" },
  addButton: {
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    borderRadius: 30,
    paddingHorizontal: 8,
  },
  counterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ff3b5c",
    borderRadius: 20,
    marginHorizontal: 4,
  },
  counterText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginHorizontal: 4,
  },
  checkoutContainer: {
    checkoutContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      elevation: 10, // ✅ Android
      zIndex: 10, // ✅ iOS
    },
  },
  totalText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  checkoutButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  checkoutButtonText: { color: "#ff3b5c", fontWeight: "700", fontSize: 16 },
});
