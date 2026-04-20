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

const ProductSearch = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const setVendorId = useSetAtom(VendorId);
  const setVendorName = useSetAtom(VendorName);
  const router = useRouter()

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          `
        id, 
        product_name, 
        description, 
        price, 
        image,
        vendor_id,
        vendors (
          id,
          name
        )
      `,
        ) // This grabs the linked vendor data
        .order("product_name", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setResults(data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ["product_name", "description"],
      threshold: 0.3,
    });
  }, [products]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(products);
      return;
    }
    const searchResults = fuse.search(query).map((res) => res.item);
    setResults(searchResults);
  }, [query, products]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRow}
      activeOpacity={0.7}
      onPress={() => {
        const vId = item.vendors?.id;
        const vName = item.vendors?.name;
        setVendorId(vId);
        setVendorName(vName);
        router.push("../(orders)/food_order");
      }}
    >
      {/* Small Image on the Left */}
      <View style={styles.imageWrapper}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="fast-food-outline" size={20} color="#FF8C00" />
          </View>
        )}
      </View>

      {/* Info on the Right */}
      <View style={styles.textDetails}>
        <View style={styles.nameRow}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.product_name}
          </Text>
          <Text style={styles.price}>{item.price} Br.</Text>
        </View>

        <Text style={styles.productDesc} numberOfLines={2}>
          {item.description || "No description provided."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Search our menu..."
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
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No matches found</Text>
          }
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
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: "#111" },
  list: { paddingHorizontal: 25, paddingBottom: 40 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFF5F0",
  },
  thumb: { width: "100%", height: "100%", resizeMode: "cover" },
  thumbPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  textDetails: { flex: 1, marginLeft: 15, justifyContent: "center" },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  productName: { fontSize: 16, fontWeight: "700", color: "#111", flex: 1 },
  price: { fontSize: 15, fontWeight: "800", color: "#FF8C00", marginLeft: 10 },
  productDesc: { fontSize: 13, color: "#777", lineHeight: 18 },
  separator: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 4 },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#AAA",
    fontSize: 14,
  },
});

export default ProductSearch;
