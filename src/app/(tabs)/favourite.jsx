// import React, { useState, useMemo } from "react";
// import {
//   View,
//   StyleSheet,
//   useWindowDimensions,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import { TabView, TabBar } from "react-native-tab-view";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../../lib/supabase";
// import FavouriteList from "../../components/FavouriteList";
// import { Feather } from "@expo/vector-icons";
// import { useAuth } from "../../providers/AuthProvider";

// const favourite = () => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const { session } = useAuth();

//   // 1. Unified lowercase keys for Routes
//   const [routes] = useState([
//     { key: "products", title: "Products" },
//     { key: "vendors", title: "Vendors" },
//     { key: "orders", title: "Orders" },
//   ]);

//   const fetchFavourites = async () => {
//     const { data, error } = await supabase
//       .from("favorites")
//       .select(
//         `
//         product_id, products(*),
//         vendor_id, vendors(*),
//         order_id, orders(*)
//       `,
//       )
//       .eq("user_id", session?.user?.id);

//     if (error) throw error;
//     return data || [];
//   };

//   const { data: allFavouritesData = [], isLoading } = useQuery({
//     queryKey: ["fetchFavourites", session?.user?.id],
//     queryFn: fetchFavourites,
//     enabled: !!session?.user?.id,
//     refetchInterval: 200000,
//   });

//   // 2. Memoize the filtered data to prevent unnecessary re-renders of the tabs
//   const filteredLists = useMemo(() => {
//     return {
//       products: allFavouritesData
//         .filter((item) => item.products)
//         .map((item) => item.products),
//       vendors: allFavouritesData
//         .filter((item) => item.vendors)
//         .map((item) => item.vendors),
//       orders: allFavouritesData
//         .filter((item) => item.orders)
//         .map((item) => item.orders),
//     };
//   }, [allFavouritesData]);

//   // 3. Define the scenes using the memoized data
//   // Replace your SceneMap block with this:
//   const renderScene = ({ route }) => {
//     switch (route.key) {
//       case "products":
//         return <FavouriteList data={filteredLists.products} type="products" />;
//       case "vendors":
//         return <FavouriteList data={filteredLists.vendors} type="vendors" />;
//       case "orders":
//         return <FavouriteList data={filteredLists.orders} type="orders" />;
//       default:
//         return null;
//     }
//   };

//   const ProfessionalHeader = ({ adminName = "User", orderCount = 0 }) => (
//     <View style={styles.headerContainer}>
//       <View style={styles.topRow}>
//         <View>
//           <Text style={styles.greeting}>Your Collection,</Text>
//           <Text style={styles.adminName}>{adminName}</Text>
//         </View>
//         <View style={styles.rightIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Feather name="search" size={20} color="#1A1A1A" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <Feather name="bell" size={20} color="#1A1A1A" />
//             {orderCount > 0 && <View style={styles.notificationDot} />}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   const renderTabBar = (props) => (
//     <TabBar
//       {...props}
//       indicatorStyle={styles.indicator}
//       style={styles.tabbar}
//       labelStyle={styles.label}
//       activeColor="#FF3B5C"
//       inactiveColor="#666"
//       pressColor="transparent"
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <ProfessionalHeader adminName={session?.user?.email?.split("@")[0]} />
//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         renderTabBar={renderTabBar}
//         onIndexChange={setIndex}
//         initialLayout={{ width: layout.width }}
//         lazy // Only load the active tab's list for better performance
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F8F9FA" },
//   headerContainer: {
//     backgroundColor: "#FFF",
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   greeting: { fontSize: 14, color: "#999", fontWeight: "500" },
//   adminName: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#1A1A1A",
//     letterSpacing: -0.5,
//   },
//   rightIcons: { flexDirection: "row", gap: 12 },
//   iconButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: "#F8F9FA",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#EEE",
//   },
//   notificationDot: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#FF3B5C",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   tabbar: {
//     backgroundColor: "#FFF",
//     elevation: 0,
//     shadowOpacity: 0,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EEE",
//   },
//   indicator: { backgroundColor: "#FF3B5C", height: 3, borderRadius: 3 },
//   label: { fontWeight: "700", fontSize: 13, textTransform: "none" },
// });

// export default favourite;

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