import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import data from "../constants/restaurants.js";
import { useRouter } from "expo-router";

const RenderingRestaurants = () => {
    const router = useRouter()
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push("../(orders)/food_order")} // optional

          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image_path }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            
            <View style={styles.info}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </View>

              <Text style={styles.address}>{item.address}</Text>

              <View style={styles.rowBottom}>
                <Text style={styles.time}>⏱ {item.delivery_time}</Text>
                <Text style={styles.fee}>{item.delivery_fee}</Text>
              </View>
            </View>

          </TouchableOpacity>
        );
      }}
    />
  );
};

export default RenderingRestaurants;

const styles = StyleSheet.create({
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
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    padding:10,
    width: "100%",
    height: 160, // same as before
    backgroundColor: "white", 
  },

  image: {
    width: "100%",
    height: "100%", 
    borderRadius: 50
  },

  info: {
    padding: 12,
    backgroundColor: "#FFF5EB"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    color: "#111",
    fontFamily: "Poppins-Bold"
  },

  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f5a623",
  },

  address: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
    fontFamily: "Poppins-Bold"
  },

  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  time: {
    fontSize: 13,
    color: "#444",
    fontFamily: "Poppins-Regular"
  },

  fee: {
    fontSize: 13,
    color: "#00b14f",
    fontWeight: "600",
  },
});
