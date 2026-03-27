import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";

const OrdersLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="food_order" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OrdersLayout;

const styles = StyleSheet.create({});
