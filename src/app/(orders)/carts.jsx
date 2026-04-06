// src/screens/Carts.jsx
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
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "expo-router";

import Modal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import { cartAtom, addToCartAtom, removeFromCartAtom } from "../../atom";
import { Ionicons } from "@expo/vector-icons";

const Carts = () => {
  const [cart] = useAtom(cartAtom);
  const [, addToCart] = useAtom(addToCartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.amount * item.price,
    0,
  );

  const renderItem = ({ item }) => {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.productName}>{item.product_name}</Text>
              <Text style={styles.restaurant}>{item.name}</Text>
              <Text style={styles.price}>${item.price * item.amount}</Text>

              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.amount}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty 😔</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <LinearGradient
          colors={["#ff6b81", "#ff3b5c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.checkoutContainer}
        >
          <Text style={styles.totalText}>Total: ${totalPrice}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              setVisible(true);
            }}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* choose payment method */}
        <Modal
          isVisible={visible}
          onBackdropPress={() => setVisible(false)}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          backdropOpacity={0.5}
        >
          <View style={styles.modalContent}>
            <View style={styles.iconBox}>
              <Ionicons name={"alert-circle"} size={32} color="#FF6B00" />
            </View>

            <Text style={styles.modalTitle}>Choose payment Mode</Text>

            <TouchableOpacity
              style={[styles.optionBtn, styles.chapaBtn]}
              onPress={() => {
                setVisible(false);
                router.push("../chapa");
              }}
            >
              {/* Modern Recommended Badge */}
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>RECOMMENDED</Text>
              </View>

              <MaterialIcons name="play-arrow" size={22} color="#FFF" />
              <Text style={styles.optionText}>Use Chapa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionBtn, styles.bankStyle]}
              onPress={() => {
                setVisible(false);
                router.push("./bank");
              }}
            >
              <MaterialIcons name="schedule" size={22} color="#FFF" />
              <Text style={styles.optionText}>Use Bank Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Carts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginBottom: 5 },
  listContent: { padding: 16, paddingBottom: 120 },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffe6e6",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  image: { width: 120, height: 120, borderRadius: 20 },
  info: { flex: 1, padding: 12 },
  productName: { fontSize: 18, fontWeight: "700", color: "#111" },
  restaurant: { fontSize: 14, color: "#ff3b5c", marginBottom: 6 },
  price: { fontSize: 16, fontWeight: "600", color: "#111", marginBottom: 8 },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  counterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ff3b5c",
    borderRadius: 20,
    marginHorizontal: 4,
  },
  counterText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  quantityText: { fontSize: 16, fontWeight: "700", marginHorizontal: 6 },
  removeButton: { marginTop: 4, paddingVertical: 4 },
  removeText: { color: "#ff3b5c", fontWeight: "700" },
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
  },
  totalText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  checkoutButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  checkoutButtonText: { color: "#ff3b5c", fontWeight: "700", fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#666" },
  modalContent: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 16 },
    }),
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#014421",
    marginBottom: 20,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    marginVertical: 8,
  },
  bankStyle: {
    backgroundColor: "#4CAF50",
  },

  rightAwayBtn: {
    backgroundColor: "#4CAF50",
  },

  optionText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelBtn: {
    marginTop: 12,
    padding: 10,
  },
  cancelText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#666",
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  chapaBtn: {
    position: "relative", // Ensure the button can anchor the badge
    overflow: "visible", // Allow the badge to pop out slightly if needed
    backgroundColor: "#6c5ce7",
  },
  badgeContainer: {
    position: "absolute",
    top: -10, // Pulls it slightly above the button edge
    right: 10, // Aligns to the right
    backgroundColor: "#FF3B30", // A modern vibrant red
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFF", // White border helps it "pop" against the button
    zIndex: 10, // Makes sure it stays on top
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9, // Small and clean
    fontWeight: "800", // Bold weight
    letterSpacing: 0.5, // Modern spacing
    textAlign: "center",
  },
});
