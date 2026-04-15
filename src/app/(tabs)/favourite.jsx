// import React, { useState, useMemo } from "react";
// import {
//   View,
//   StyleSheet,
//   useWindowDimensions,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../../lib/supabase";
// import OrderList from "../../components/OrderList";
// import { Feather } from "@expo/vector-icons";

// const AdminDashboard = () => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     { key: "unassigned", title: "Unassigned" },
//     { key: "kitchen", title: "In Kitchen" },
//     { key: "delivery", title: "Out for Delivery" },
//   ]);
//   const isOnline = true

//   const ProfessionalHeader = ({ adminName = "Admin", orderCount = 0 }) => {
//     return (
//       <View style={styles.headerContainer}>
//         <View style={styles.topRow}>
//           <View>
//             <Text style={styles.greeting}>Welcome back,</Text>
//             <Text style={styles.adminName}>{adminName}</Text>
//           </View>

//           <View style={styles.rightIcons}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Feather name="search" size={20} color="#1A1A1A" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.iconButton}>
//               <Feather name="bell" size={20} color="#1A1A1A" />
//               {orderCount > 0 && <View style={styles.notificationDot} />}
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.statsRow}>
//           <View
//             style={[
//               styles.statusBadge,
//               { backgroundColor: isOnline ? "#E8F5E9" : "#FFEBEE" }, // Green vs Red background
//             ]}
//           >
//             <View
//               style={[
//                 styles.liveIndicator,
//                 { backgroundColor: isOnline ? "#4CAF50" : "#F44336" }, // Green vs Red dot
//               ]}
//             />
//             <Text
//               style={[
//                 styles.statusText,
//                 { color: isOnline ? "#2E7D32" : "#C62828" }, // Green vs Red text
//               ]}
//             >
//               {isOnline ? "Online" : "Offline"}
//             </Text>
//           </View>

//           {/* Date or sync time */}
//           <Text style={styles.dateText}>
//             {new Date().toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // Function to fetch all undelivered orders once
//   const fetchUndeliveredOrders = async () => {
//     const { data } = await supabase
//       .from("orders")
//       .select(`*, orders_products(*, products(*,vendors(*))), payment(*),profile(*)`)
//       .eq("order_delivered", false)
//       .order("created_at", { ascending: true });
//     return data;
//   };
  
//   // Fetch all undelivered orders once
//   const { data: allOrders = [], isLoading } = useQuery({
//     queryKey: ["adminOrders"],
//     queryFn: fetchUndeliveredOrders,
//     refetchInterval: 5000,
//   });

//   // Add the '|| []' to ensure you are never calling .filter on null

//   // get all unassigned orders
//   const unassignedOrders = useMemo(
//     () => (allOrders || []).filter((o) => !o.courier_id ),
//     [allOrders],
//   );

//   // get all orders which are in the kitchen
//   const kitchenOrders = useMemo(
//     () => (allOrders || []).filter((o) => o.courier_id && !o.is_picked_up),
//     [allOrders],
//   );

//   // get all orders which are out for delivery
//   const deliveryOrders = useMemo(
//     () => (allOrders || []).filter((o) => o.is_picked_up),
//     [allOrders],
//   );

//   // Define the screens for each tab
//   const renderScene = SceneMap({
//     unassigned: () => <OrderList data={unassignedOrders} type="unassigned" />,
//     kitchen: () => <OrderList data={kitchenOrders} type="kitchen" />,
//     delivery: () => <OrderList data={deliveryOrders} type="delivery" />,
//   });

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={styles.indicator}
//       style={styles.tabbar}
//       labelStyle={styles.label}
//       activeColor="#FF3B5C"
//       inactiveColor="#666"
//       pressColor="transparent"
//       scrollEnabled={false} // Since we only have 3 tabs
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <ProfessionalHeader />
//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         renderTabBar={renderTabBar}
//         onIndexChange={setIndex}
//         initialLayout={{ width: layout.width }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8F9FA" },
//   header: { padding: 20, backgroundColor: "#FFF", paddingTop: 60 },
//   headerTitle: { fontSize: 24, fontWeight: "900", color: "#1A1A1A" },
//   tabbar: {
//     backgroundColor: "#FFF",
//     elevation: 0,
//     shadowOpacity: 0,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEE",
//   },
//   indicator: { backgroundColor: "#FF3B5C", height: 3, borderRadius: 3 },
//   label: { fontWeight: "700", fontSize: 13, textTransform: "none" },
//   headerContainer: {
//     backgroundColor: "#FFF",
//     paddingTop: 60, // Adjust based on your device notch
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   greeting: {
//     fontSize: 14,
//     color: "#999",
//     fontWeight: "500",
//   },
//   adminName: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#1A1A1A",
//     letterSpacing: -0.5,
//   },
//   rightIcons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   iconButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#F8F9FA",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#EEE",
//   },
//   notificationDot: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#FF3B5C",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 15,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E8F5E9",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   liveIndicator: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#4CAF50",
//     marginRight: 6,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "#2E7D32",
//     textTransform: "uppercase",
//   },
//   dateText: {
//     fontSize: 13,
//     color: "#666",
//     fontWeight: "600",
//   },
// });

// export default AdminDashboard;


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const favourite = () => {
  return (
    <View>
      <Text>favourite</Text>
    </View>
  )
}

export default favourite

const styles = StyleSheet.create({})