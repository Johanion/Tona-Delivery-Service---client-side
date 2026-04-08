import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const BankLayout = () => {
  return (
      <SafeAreaView style={{flex:1}}>
        <Stack>
          <Stack.Screen name="mainPayment" options={{ headerShown: false }} />
          <Stack.Screen name="paymentReceitsInsertion" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
  );
};

export default BankLayout;

const styles = StyleSheet.create({});
