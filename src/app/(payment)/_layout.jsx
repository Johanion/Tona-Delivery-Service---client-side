import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const OrdersLayout = () => {
  return (
    <PaymentLayout>
      <SafeAreaView style={{flex:1}}>
        <Stack>
          <Stack.Screen name="chapa" options={{ headerShown: false }} />
          <Stack.Screen name="bank" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </PaymentLayout>
  );
};

export default OrdersLayout;

const styles = StyleSheet.create({});
