import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { supabase } from "../lib/supabase";

import { VendorId, VendorName } from "../atom.jsx";
import VendorCardSkelton from "../skeleton/VendorCardSkelton.jsx";
import ErrorState from "../components/ErrorState.jsx";

const RenderingVendors = () => {
  const router = useRouter();
  const setVendorId = useSetAtom(VendorId);
  const setVendorName = useSetAtom(VendorName);

  // calling supabase to fetch vendors
  const fetchVendors = async () => {
    const { data, error } = await supabase.from("vendors").select("*");

    if (error) throw new Error(error.message);
    return data;
  };

  // TanStack Query Hook
  const {
    data: vendors,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
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

  return (
    <FlatList
      data={vendors}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => {
              router.push("../(orders)/food_order");
              setVendorId(item.id);
              setVendorName(item.name);
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
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
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default RenderingVendors;

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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "100%",
    height: 160, // same as before
    backgroundColor: "white",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  info: {
    padding: 12,
    backgroundColor: "#FFF5EB",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    color: "#111",
    fontFamily: "Poppins-Bold",
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
    fontFamily: "Poppins-Bold",
  },

  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  time: {
    fontSize: 13,
    color: "#444",
    fontFamily: "Poppins-Regular",
  },

  fee: {
    fontSize: 13,
    color: "#00b14f",
    fontWeight: "600",
  },
});
