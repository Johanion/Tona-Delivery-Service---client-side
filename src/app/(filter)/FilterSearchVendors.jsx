import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { VendorId, VendorName } from "../../atom";

import Fuse from "fuse.js";
import { supabase } from "../../lib/supabase";

const VendorSearch = () => {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const setVendorId = useSetAtom(VendorId);
  const setVendorName = useSetAtom(VendorName);
  const router = useRouter()

  const fetchVendors = async () => {
    try {
      setLoading(true);
      // We join with the 'address' table using Supabase's select syntax
      const { data, error } = await supabase
        .from("vendors")
        .select("id,name,type,rating,image,address(address)")
        .order("name", { ascending: true });

      if (error) throw error;
      setVendors(data || []);
      setResults(data || []);
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(vendors, {
      keys: ["name", "type", "address.address"],
      threshold: 0.3,
    });
  }, [vendors]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(vendors);
      return;
    }
    const searchResults = fuse.search(query).map((res) => res.item);
    setResults(searchResults);
  }, [query, vendors]);

  const renderVendor = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRow}
      activeOpacity={0.7}
      onPress={() => {
        router.push("../(orders)/food_order");
        setVendorId(item.id);
        setVendorName(item.name);
      }}
    >
      {/* Image Wrapper */}
      <View style={styles.imageWrapper}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="storefront-outline" size={24} color="#FF8C00" />
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.textDetails}>
        <View style={styles.nameRow}>
          <Text style={styles.vendorName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={12} color="#FF8C00" />
            <Text style={styles.ratingText}>{item.rating || "N/A"}</Text>
          </View>
        </View>

        {/* Shows the 'type' (e.g. Restaurant, Hotel) */}
        <Text style={styles.vendorType}>{item.type || "Vendor"}</Text>

        {/* Location from the joined address table */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color="#999" />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.address?.address || item.address?.label || "Location not set"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Vendors</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Search by name or location..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF8C00"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVendor}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 15 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 15 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F9",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  list: { paddingHorizontal: 25 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFF5F0",
  },
  thumb: { width: "100%", height: "100%" },
  thumbPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  textDetails: { flex: 1, marginLeft: 15 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vendorName: { fontSize: 16, fontWeight: "700", color: "#111", flex: 1 },
  ratingBox: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 13, fontWeight: "600", color: "#444", marginLeft: 3 },
  vendorType: {
    fontSize: 13,
    color: "#FF8C00",
    marginBottom: 4,
    fontWeight: "500",
  },
  locationRow: { flexDirection: "row", alignItems: "center" },
  addressText: { fontSize: 12, color: "#999", marginLeft: 4 },
  separator: { height: 1, backgroundColor: "#F3F3F3" },
});

export default VendorSearch;
