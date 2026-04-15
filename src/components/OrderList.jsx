// import React from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import {useSetAtom} from "jotai"
// import {selectedOrderAtom} from "../atom"

// const { width } = Dimensions.get("window");

// const OrderList = ({ data, type }) => {
//   const router = useRouter();
//   const setOrderAtoms = useSetAtom(selectedOrderAtom)

//   const renderItem = ({ item }) => {
//     // 1. Calculate how many restaurants are in this order
//     const vendorCount = [
//       ...new Set(item.orders_products?.map((op) => op.products?.vendors?.name)),
//     ].length;

//     // 2. Logic for the Action Button based on Tab Type
//     const getActionButton = () => {
//       if (type === "unassigned")
//         return { label: "Assign Rider", color: "#FF3B5C", icon: "user-plus" };
//       if (type === "kitchen")
//         return { label: "View Prep", color: "#FF9800", icon: "clock" };
//       if (type === "delivery")
//       return { label: "Live Track", color: "#4CAF50", icon: "map-pin" };
//     if (type === "delivered")
//       return { label: "explore", color: "#FF9800", icon: "compass" };
//     };

//     // route based on the the Tab Type
//     const getCorrectRoute = () => {
//       // first passing data using atom G.state management
//       setOrderAtoms(item);

//       // conditions to determine where to route based on the order status
//       if (type === "unassigned") return router.push("../verify-assign-orders");
//       if (type === "kitchen") return router.push("../viewPreparation");
//       else return router.push("../trackDelivery");
//     };

//     const action = getActionButton();

//     // get color for bank and chapa
//     const getPaymentStyle = (type) => {
//       const normalizedType = type?.toLowerCase();

//       if (normalizedType === "chapa") {
//         return {
//           bg: "#E8F5E9", // Light Green
//           text: "#2E7D32", // Dark Green
//           label: "CHAPA",
//         };
//       }

//       if (normalizedType === "bank" || normalizedType === "transfer") {
//         return {
//           bg: "#FFEBEE", // Light Red
//           text: "#C62828", // Dark Red
//           label: "BANK",
//         };
//       }

//       // Fallback for Cash or others
//       return {
//         bg: "#F5F5F5",
//         text: "#616161",
//         label: type || "PENDING",
//       };
//     };
//     const paymentStyle = getPaymentStyle(item.payment?.type);
//     // 1. Get the array, and filter out any items that are null or undefined immediately
//     const productsArray = (item.orders_products || []).filter(
//       (op) => op !== undefined && op !== null,
//     );

//     // 2. Extract the names using the exact path from your LOG
//     const vendorNames = productsArray
//       .map((op) => op.products?.vendors?.name)
//       .filter(Boolean); // This removes any null/undefined names

//     // 3. Get Unique names
//     const uniqueVendors = [...new Set(vendorNames)];

//     // 4. Display Logic
//     const vendorDisplayName =
//       uniqueVendors.length > 0
//         ? uniqueVendors.length > 1
//           ? `${uniqueVendors.length} Restaurants`
//           : `${uniqueVendors.length} Restaurants`
//         : `${uniqueVendors.length} Restaurants`; // This will show for those 5 undefined orders

//     return (
//       <TouchableOpacity
//         activeOpacity={0.9}
//         style={styles.card}
//         onPress={() => {
//           getCorrectRoute()
//         }}
//       >
//         {/* Top Section: ID and Time */}
//         <View style={styles.cardHeader}>
//           <View style={styles.idBadge}>
//             <Text style={styles.idText}>
//               #{item.id.slice(0, 8).toUpperCase()}
//             </Text>
//           </View>
//           <Text style={styles.timeText}>
//             {new Date(item.created_at).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </Text>
//         </View>

//         {/* Middle Section: Vendor and Price */}
//         <View style={styles.mainInfo}>
//           <View style={styles.iconCircle}>
//             <MaterialCommunityIcons
//               name="silverware-fork-knife"
//               size={20}
//               color="#FF3B5C"
//             />
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.vendorText} numberOfLines={1}>
//               {vendorDisplayName}
//             </Text>
//             <Text style={styles.priceText}>Birr {item.total_price}</Text>
//           </View>
//         </View>

//         {/* Bottom Section: Action and Status */}
//         <View style={styles.footer}>
//           <View
//             style={[styles.paymentBadge, { backgroundColor: paymentStyle.bg }]}
//           >
//             <Text style={[styles.paymentText, { color: paymentStyle.text }]}>
//               {paymentStyle.label}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={[styles.actionButton, { backgroundColor: action.color }]}
//           >
//             <Feather
//               name={action.icon}
//               size={14}
//               color="#FFF"
//               style={{ marginRight: 6 }}
//             />
//             <Text style={styles.actionLabel}>{action.label}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Urgency Indicator for Unassigned */}
//         {type === "unassigned" && <View style={styles.urgencyBar} />}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <FlatList
//       data={data}
//       keyExtractor={(item) => item.id}
//       renderItem={renderItem}
//       contentContainerStyle={styles.listPadding}
//       showsVerticalScrollIndicator={false}
//       ListEmptyComponent={
//         <View style={styles.emptyContainer}>
//           <Feather name="inbox" size={50} color="#CCC" />
//           <Text style={styles.emptyText}>No {type} orders right now</Text>
//         </View>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   listPadding: { padding: 16, paddingBottom: 100 },
//   card: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     overflow: "hidden",
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   idBadge: {
//     backgroundColor: "#F0F0F0",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//   },
//   idText: { fontSize: 11, fontWeight: "800", color: "#666" },
//   timeText: { fontSize: 12, color: "#999", fontWeight: "600" },
//   mainInfo: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
//   iconCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#FFF0F2",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   vendorText: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
//   priceText: {
//     fontSize: 14,
//     color: "#4CAF50",
//     fontWeight: "700",
//     marginTop: 2,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderTopColor: "#F5F5F5",
//     paddingTop: 12,
//   },
//   paymentBadge: {
//     backgroundColor: "#E3F2FD",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   paymentText: { fontSize: 12, fontFamily: "Poppins-Black", color: "#1976D2" },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   actionLabel: { color: "#FFF", fontSize: 12, fontWeight: "700" },
//   urgencyBar: {
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 4,
//     backgroundColor: "#FF3B5C",
//   },
//   emptyContainer: {
//     marginTop: 100,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyText: {
//     marginTop: 10,
//     color: "#999",
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });

// export default OrderList;


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OrderList = () => {
  return (
    <View>
      <Text>OrderList</Text>
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({})