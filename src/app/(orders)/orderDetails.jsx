import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { selectedOrderItems } from "../../atom";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../providers/AuthProvider";

const { width } = Dimensions.get("window");

const OrderDetail = () => {
  const {session, isLoading} = useAuth()
  const router = useRouter();
  const order = useAtomValue(selectedOrderItems);
  const qrData = JSON.stringify({
    user_id: session.user.id,
    order_id: order.id,
  });

  const { subtotal, deliveryFee } = useMemo(() => {
    if (!order?.orders_products) return { subtotal: 0, deliveryFee: 0 };
    const calcSub = order.orders_products.reduce((acc, item) => {
      return acc + (item.products?.price || 0) * (item.quantity || 0);
    }, 0);

    const fee = (order.total_price || 0) - calcSub;
    return { subtotal: calcSub, deliveryFee: fee > 0 ? fee : 0 };
  }, [order]);

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B5C" />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- FLOATING BLURRED HEADER --- */}
      <View style={styles.glassHeader}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconCircle}
            >
              <Feather name="arrow-left" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.navTitle}>Order Receipt</Text>
            </View>
            <TouchableOpacity style={styles.iconCircle}>
              <Feather name="share-2" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient colors={["#FFF", "#F9FAFB"]} style={styles.mainCard}>
          {/* Status Banner */}
          <View style={styles.heroSection}>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: order.is_dropped_off ? "#ECFDF5" : "#FFF1F2",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: order.is_dropped_off
                      ? "#10B981"
                      : "#FF3B5C",
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusPillText,
                  { color: order.is_dropped_off ? "#065F46" : "#9F1239" },
                ]}
              >
                {order.is_dropped_off ? "DELIVERED" : "ORDER IN TRANSIT"}
              </Text>
            </View>

            {/* styles for date */}
            <View style={styles.dateBadge}>
              <Feather
                name="calendar"
                size={12}
                color="#A39495"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.dateText}>
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Product Items */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>YOUR ITEMS</Text>
            {order.orders_products?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Image
                  source={{ uri: item.products?.image }}
                  style={styles.productImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.products?.product_name}
                  </Text>
                  <View style={styles.restaruantBadge}>
                    <Text style={styles.itemSub}>
                      {item.products?.vendors?.name || "Tona Store"}
                    </Text>
                  </View>
                  <Text style={styles.itemQty}>Quantity: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  Birr {(item.products?.price || 0) * (item.quantity || 0)}
                </Text>
              </View>
            ))}
          </View>

          {/* Dotted Line for "Receipt" look */}
          <View style={styles.receiptEdge} />

          {/* Billing Detail */}
          <View style={styles.billingSection}>
            <View style={styles.billLine}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>
                Birr {subtotal.toLocaleString()}
              </Text>
            </View>
            <View style={styles.billLine}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>
                Birr {deliveryFee.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.billLine, styles.totalLine]}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <View style={styles.restaruantBadge}>
                <Text style={styles.totalValue}>
                  Birr {order.total_price?.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* --- QR SECTION --- */}
        {/* QR VERIFICATION */}
        <View style={styles.qrContainer}>
          <View style={styles.qrInner}>
            {/* QR code section */}
            <QRCode value={qrData} size={230} color="#0F172A" />

            {/* scan QR code Disclaimer */}
            <View style={styles.qrTextContent}>
              <Feather name="info" size={18} color="#64748B" />
              <Text style={styles.qrDesc}>
                Present this code to the vendor for pickup verification.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  glassHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
    }),
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  headerTitleGroup: { alignItems: "center" },
  navTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  navSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    marginTop: 2,
  },

  scrollContent: { padding: 16, paddingTop: 110, paddingBottom: 40 },
  mainCard: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 4,
    overflow: "hidden",
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 12,
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    alignItems: "center",
  },
  statusPillText: { fontSize: 11, fontWeight: "900" },
  heroDate: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    alignItems: "center",
  },
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
  dateText: { fontSize: 12, color: "#3D3334", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginHorizontal: 24 },
  section: { padding: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 1.5,
    marginBottom: 20,
  },

  itemRow: { flexDirection: "row", marginBottom: 18, alignItems: "center" },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  itemInfo: { flex: 1, marginLeft: 16 },
  itemName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemSub: { fontSize: 13, color: "#E0115F", marginTop: 2 },
  restaruantBadge: {
    backgroundColor: "#FFF0F2",
    padding: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  itemQty: { fontSize: 12, fontWeight: "600", color: "#9CA3AF", marginTop: 4 },
  itemPrice: { fontSize: 15, fontWeight: "800", color: "#111827" },

  receiptEdge: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 24,
    marginVertical: 10,
  },

  billingSection: { padding: 24, backgroundColor: "rgba(249, 250, 251, 0.5)" },
  billLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  billLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  billValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
  totalLine: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: { fontSize: 16, fontWeight: "800", color: "#111827" },
  totalValue: { fontSize: 22, fontFamily: "Poppins-Bold", color: "#E0115F" },

  qrContainer: { marginTop: 30, alignItems: "center", paddingHorizontal: 24 },
  qrTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  qrDescription: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  qrWrapper: {
    marginTop: 25,
    padding: 25,
    backgroundColor: "#FFF",
    borderRadius: 30,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  qrInner: {
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },

  qrCornerTopLeft: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FF3B5C",
  },
  qrCornerTopRight: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FF3B5C",
  },
  qrCornerBottomLeft: {
    position: "absolute",
    bottom: 15,
    left: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FF3B5C",
  },
  qrCornerBottomRight: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FF3B5C",
  },

  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6366F1",
    marginLeft: 6,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#9CA3AF", fontWeight: "600" },
  qrTextContent: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  qrDesc: {
    flex: 1,
    flexShrink: 1,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
    marginLeft: 10,
    textAlign: "left",
  },

});

export default OrderDetail;
