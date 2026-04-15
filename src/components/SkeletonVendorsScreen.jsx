import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";


export default function SkeletonVendorsScreen() {
  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Skeleton
          show={true}
          height={150}
          width={"100%"}
          colorMode="light"
          backgroundColor="#D4D4D4"
        />
      </View>

      {/* INFO */}
      <View style={styles.info}>
        {/* Name + Rating row */}
        <View style={styles.row}>
          <Skeleton
            show={true}
            height={20}
            width={140}
            colorMode="light"
            backgroundColor="#D4D4D4"
          />

          <Skeleton
            show={true}
            height={20}
            width={50}
            colorMode="light"
            backgroundColor="#D4D4D4"
          />
        </View>
      </View>
    </View>
  );
}

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

  imageContainer: {
    height: 160,
    width: "100%",
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
});