import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PaymentLayout = () => {
  return (
      <SafeAreaView style={{flex:1}}>
        <Stack>
          <Stack.Screen name="chapa" options={{ headerShown: false }} />
          <Stack.Screen name="mainPayment" options={{ headerShown: false }} />
          <Stack.Screen name="paymentReceitsInsertion" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
  );
};

export default PaymentLayout;

const styles = StyleSheet.create({});
