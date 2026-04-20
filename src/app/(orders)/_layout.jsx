import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const OrdersLayout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="food_order" options={{ headerShown: false }} />
          <Stack.Screen name="carts" options={{ headerShown: false }} />
          <Stack.Screen name="orderDetails" options={{ headerShown: false }} />
          <Stack.Screen
            name="orderDetailsHistory"
            options={{ headerShown: false }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OrdersLayout;

const styles = StyleSheet.create({});
