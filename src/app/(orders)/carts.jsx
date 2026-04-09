import React, { useState } from "react";
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
  TextInput
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { useRouter } from "expo-router";
import Modal from "react-native-modal";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { cartAtom, addToCartAtom, removeFromCartAtom } from "../../atom.jsx";
import restaurant from "../../constants/restaurants";
import { useMemo } from "react";

const { width } = Dimensions.get("window");

const Carts = () => {
  const [cart] = useAtom(cartAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  // get total price for all orders
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.amount * item.price,
    0,
  );

  // group cart based on the restaurant /memoized/
  const groupedArray = useMemo(() => {
    const groupedCart = cart.reduce((acc, item) => {
      const key = item.restaurant_id;

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(groupedCart);
  }, [cart]);

  const renderItem = ({ item }) => {
    const restaurantId = item[0];
    const items = item[1];
    const restaurantName = restaurant.find((r) => r.id == restaurantId)?.name;

    return (
      <>
        {/* Restaurants header */}
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="restaurant" size={18} color="#FF3B5C" />
            </View>

            <View>
              <Text style={styles.restaurantName}>{restaurantName}</Text>
              <Text style={styles.restaurantSub}>Restaurant orders</Text>
            </View>
          </View>

          <View style={styles.itemBadge}>
            <Feather name="shopping-bag" size={12} color="#fff" />
            <Text style={styles.itemBadgeText}>{items.length}</Text>
          </View>
        </View>

        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.product_name}
                  </Text>
                  <Text style={styles.restaurant}>{restaurantName}</Text>
                </View>
              </View>

              {/* Added: Beautifully Styled Description */}
              <Text style={styles.description} numberOfLines={2}>
                {item.description ||
                  "Freshly prepared with the finest ingredients, delivered hot to your door."}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>Birr {item.price.toFixed(2)}</Text>

                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Feather name="minus" size={14} color="#1A1A1A" />
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{item.amount}</Text>

                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Feather name="plus" size={14} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </>
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Feather name="shopping-bag" size={50} color="#FF3B5C" />
        </View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>
          Looks like you haven't added anything yet.
        </Text>
        <TouchableOpacity
          style={styles.shopNowBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.shopNowText}>Start Ordering</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <LinearGradient
          colors={["#FFDBB4", "#FFF5EB", "#FFFFFF"]}
          style={styles.gradient}
        >
          {/* Refined Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButtonCircle}
            >
              <Feather name="chevron-left" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>My Cart</Text>
              <Text style={styles.headerSub}>{cart.length} items selected</Text>
            </View>
          </View>

          <FlatList
            data={groupedArray}
            keyExtractor={(item) => item[0]}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Premium Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Grand Total</Text>
              </View>
              <Text style={styles.totalAmount}>
                Birr {totalPrice.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setVisible(true)}
            >
              <LinearGradient
                colors={["#FF4B68", "#FF3B5C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkoutBtn}
              >
                <Text style={styles.checkoutBtnText}>Checkout Now</Text>
                <View style={styles.btnIconBg}>
                  <Feather name="arrow-right" size={18} color="#FF3B5C" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Payment Modal stays same as previous high-quality version */}
          <Modal
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            backdropOpacity={0.3}
            style={styles.modal}
            onSwipeComplete={() => setVisible(false)}
            swipeDirection="down"
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Payment Method</Text>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => {
                  setVisible(false);
                  router.push("../chapa");
                }}
              >
                <View
                  style={[styles.paymentIcon, { backgroundColor: "#6c5ce7" }]}
                >
                  <Ionicons name="flash" size={24} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentName}>Chapa</Text>
                  <Text style={styles.paymentSub}>Secure Instant Pay</Text>
                </View>
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>Reccommended</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => {
                  setVisible(false);
                  router.push("../(payment)/(bank)/mainPayment");
                }}
              >
                <View
                  style={[styles.paymentIcon, { backgroundColor: "#4CAF50" }]}
                >
                  <MaterialIcons
                    name="account-balance"
                    size={24}
                    color="#FFF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentName}>Bank Transfer</Text>
                  <Text style={styles.paymentSub}>Manual Verification</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeModalText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Carts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  gradient: { flex: 1 },

  // Header Style
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButtonCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: 13, color: "#666", fontWeight: "500" },

  listContent: { padding: 20, paddingBottom: 180 },

  // Card Styles
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 18,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: "#F8F9FA",
  },
  info: { flex: 1, marginLeft: 15, justifyContent: "space-between" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productName: { fontSize: 17, fontWeight: "800", color: "#1A1A1A" },
  restaurant: {
    fontSize: 12,
    color: "#FF3B5C",
    fontWeight: "600",
    marginTop: 1,
  },

  // Description Style
  description: {
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
    marginVertical: 6,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 17, fontWeight: "900", color: "#1A1A1A" },

  trashBtn: { padding: 5 },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  counterBtn: {
    width: 28,
    height: 28,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 12,
    color: "#1A1A1A",
  },

  // Footer Styles
  footer: {
    position: "aboslute",
    bottom: 0,
    width: width,
    backgroundColor: "#FFF",
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  totalLabel: {
    fontSize: 14,
    color: "#999",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  totalSub: { fontSize: 11, color: "#BBB", fontWeight: "600" },
  totalAmount: { fontSize: 26, fontWeight: "900", color: "#1A1A1A" },

  checkoutBtn: {
    borderRadius: 20,
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  checkoutBtnText: { color: "#FFF", fontWeight: "800", fontSize: 18 },
  btnIconBg: {
    width: 35,
    height: 35,
    backgroundColor: "#FFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF0F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontWeight: "900", color: "#1A1A1A" },
  emptySub: { fontSize: 14, color: "#999", marginTop: 5 },
  shopNowBtn: {
    marginTop: 30,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
  },
  shopNowText: { color: "#FFF", fontWeight: "800", fontSize: 16 },

  // Modal Styles
  modal: { justifyContent: "flex-end", margin: 0, marginBottom: 30 },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#EEE",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 25,
    textAlign: "center",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FBFBFB",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  paymentName: { fontSize: 17, fontWeight: "800", color: "#1A1A1A" },
  paymentSub: { fontSize: 12, color: "#999", marginTop: 2 },
  miniBadge: {
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  closeModal: { marginTop: 10, padding: 15, alignItems: "center" },
  closeModalText: { color: "#BBB", fontWeight: "700", fontSize: 15 },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
    paddingHorizontal: 5,
  },

  restaurantLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF0F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1A1A1A",
  },

  restaurantSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    fontWeight: "500",
  },

  itemBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B5C",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },

  itemBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  inputBox: {
  marginTop: 15,
  backgroundColor: "#FFF",
  borderRadius: 16,
  padding: 14,
  borderWidth: 1,
  borderColor: "#F0F0F0",

  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
},

inputLabel: {
  fontSize: 13,
  fontWeight: "800",
  color: "#121212",
  marginBottom: 8,
},

textInput: {
  minHeight: 80,
  fontSize: 13,
  color: "#121212",
  textAlignVertical: "top", // important for Android
},
});
