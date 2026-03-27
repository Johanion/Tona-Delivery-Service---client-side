import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, Platform, Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const TAB_BAR_HEIGHT = 68; // Fixed comfortable height for pill style

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#FF6B00", // Vibrant orange
        tabBarInactiveTintColor: "#888888",

        // Custom floating pill tab bar
        tabBarStyle: {
          position: "absolute",
          bottom: insets.bottom + 12,
          left: 16,
          right: 16,
          height: TAB_BAR_HEIGHT,
          borderRadius: 25, // Fully pill-shaped
          backgroundColor: "rgba(255, 255, 255, 0.95)", // Semi-transparent white
          borderWidth: 1,
          borderColor: "rgba(255, 107, 0, 0.1)",
          shadowColor: "#FF6B00",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 15, // Strong shadow on Android
          paddingHorizontal: 8,
          paddingBottom: 0,
          marginHorizontal: 15
        },

        tabBarItemStyle: {
          paddingVertical: 8,
        },

        // Use custom button for better press effect
        tabBarButton: (props) => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.7}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          />
        ),
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Orders */}
      <Tabs.Screen
        name="order"
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Favourites */}
      <Tabs.Screen
        name="favourite"
        options={{
          tabBarLabel: "Favourites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
