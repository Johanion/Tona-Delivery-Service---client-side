import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
// import QRCode from "react-native-qrcode-svg"; // Ensure this is installed

const { width } = Dimensions.get("window");

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // In a real app, you'd fetch by ID. Using o2 as an example for multiple products.
  const order = {
    id: "o2",
    date: "10 Oct, 2026",
    status: "In Transit",
    products: [
      {
        id: "p2",
        product_name: "Chicken Bucket",
        description: "Crispy fried chicken with signature spices.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086",
        price: 100,
        quantity: 4,
      },
      {
        id: "p3",
        product_name: "Cold Pepsi",
        description: "Chilled 500ml bottle.",
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e",
        price: 45,
        quantity: 1,
      },
    ],
    is_verfied_up: true,
    is_picked_up: true,
    is_dropped_off: false,
  };

  const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#FFDBB4", "#FFF5EB", "#FFFFFF"]} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={26} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Feather name="help-circle" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Order Info Card */}
          <View style={styles.mainCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{order.is_picked_up ? "In Transit" : "Verified"}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Summary</Text>
            {order.products.map((item, index) => (
              <View key={index} style={styles.productItem}>
                <Image source={{ uri: item.image }} style={styles.productImg} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.product_name}</Text>
                  <Text style={styles.productDesc} numberOfLines={1}>{item.description}</Text>
                  <Text style={styles.productQty}>Quantity: {item.quantity}</Text>
                </View>
                <Text style={styles.productPrice}>Birr {item.price * item.quantity}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            {/* Price Breakdown */}
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Subtotal</Text>
              <Text style={styles.billingValue}>Birr {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Delivery Fee</Text>
              <Text style={styles.billingValue}>Birr {deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.billingRow, { marginTop: 10 }]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>Birr {total.toFixed(2)}</Text>
            </View>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Delivery QR Code</Text>
            <Text style={styles.qrSub}>Show this to the courier upon arrival to confirm delivery.</Text>
            {/* <View style={styles.qrWrapper}>
              <QRCode
                value={`ORDER_${order.id}`}
                size={160}
                color="#1A1A1A"
                backgroundColor="transparent"
              />
            </View> */}
            <View style={styles.securityNote}>
              <Feather name="shield" size={14} color="#4CAF50" />
              <Text style={styles.securityText}>Secure Verification Active</Text>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  gradient: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.1,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  helpButton: { width: 45, alignItems: "flex-end" },
  
  scrollContent: { padding: 20, paddingBottom: 60 },

  mainCard: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    marginBottom: 25,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4CAF50", marginRight: 8 },
  statusText: { fontSize: 12, fontWeight: "700", color: "#4CAF50" },
  orderIdText: { fontSize: 13, fontWeight: "700", color: "#BBB" },

  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#1A1A1A", marginBottom: 15 },
  productItem: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  productImg: { width: 60, height: 60, borderRadius: 12, backgroundColor: "#F8F9FA" },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },
  productDesc: { fontSize: 12, color: "#999", marginTop: 2 },
  productQty: { fontSize: 12, fontWeight: "600", color: "#FF3B5C", marginTop: 4 },
  productPrice: { fontSize: 14, fontWeight: "800", color: "#1A1A1A", marginLeft: 10 },

  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 15, borderStyle: "dashed", borderWidth: 0.5 },
  billingRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  billingLabel: { color: "#999", fontSize: 14, fontWeight: "600" },
  billingValue: { color: "#1A1A1A", fontSize: 14, fontWeight: "700" },
  totalLabel: { fontSize: 16, fontWeight: "900", color: "#1A1A1A" },
  totalValue: { fontSize: 18, fontWeight: "900", color: "#FF3B5C" },

  // QR Section
  qrContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 30,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    borderStyle: "dashed",
  },
  qrTitle: { fontSize: 18, fontWeight: "900", color: "#1A1A1A", marginBottom: 8 },
  qrSub: { fontSize: 12, color: "#999", textAlign: "center", marginBottom: 25, lineHeight: 18 },
  qrWrapper: {
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 5,
    shadowOpacity: 0.1,
  },
  securityNote: { flexDirection: "row", alignItems: "center", marginTop: 20, gap: 6 },
  securityText: { fontSize: 11, color: "#4CAF50", fontWeight: "700" },
});

export default OrderDetail;