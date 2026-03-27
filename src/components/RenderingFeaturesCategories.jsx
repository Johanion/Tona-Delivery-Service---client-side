import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { router } from "expo-router";
import * as Linking from "expo-linking";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.82;        // Wider premium feel
const CARD_SPACING = 20;

const TrendingItem = ({ item, index, scrollX }) => {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + CARD_SPACING),
    index * (CARD_WIDTH + CARD_SPACING),
    (index + 1) * (CARD_WIDTH + CARD_SPACING),
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.92, 1, 0.92],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={{ transform: [{ scale }], overflow: "visible" }}>
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.cardContainer}
        onPress={() => {}}
      >
        <LinearGradient
          colors={item.colors || ["#FF6B00", "#FF8A3D", "#FFB366"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.card}
        >
          {/* Floating Image - Bottom Right with Overlay Effect */}
          <Image
            source={item.image}
            style={styles.image
              
            }
            resizeMode="contain"
          />

          {/* Dark Overlay for better text readability */}
          <LinearGradient
            colors={["transparent", "#FF8A3D"]}
            style={styles.overlay}
          />

          {/* Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            )}

            {/* Shop Now Button */}
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const RenderingFeaturesCategories = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        style={{overflow: "visible"}}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        disableIntervalMomentum={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <TrendingItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Premium Animated Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_SPACING),
            index * (CARD_WIDTH + CARD_SPACING),
            (index + 1) * (CARD_WIDTH + CARD_SPACING),
          ];

          const width = scrollX.interpolate({
            inputRange,
            outputRange: [8, 28, 8],        // Active dot becomes much wider
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width, opacity, backgroundColor: "#FF6B00" },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default RenderingFeaturesCategories;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 20,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
    marginBottom: 20
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    overflow: "visible"
  },
  card: {
    height: 210,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    overflow: "visible",
  },

  /* Floating Image - Bottom Right */
  image: {
  position: "absolute",
  bottom: -50,   // push it half outside
  right: -40,    // push it half outside
  width: 150,
  height: 150,
  zIndex: 10,
  borderRadius: 10
},

  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },

  textContainer: {
    zIndex: 2,
  },

  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#FFFFFF",
    lineHeight: 26,
    marginBottom: 6,
  },

  subtitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 16,
  },

  /* Shop Now Button */
  shopButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: "flex-start",
  },

  shopButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: "600",
  },

  /* Premium Dots */
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B00",
  },
});