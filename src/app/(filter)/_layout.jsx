import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  SafeAreaContext,
} from "react-native-safe-area-context";

const MapsLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="FilterSearchProducts"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FilterSearchVendors"
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
};

export default MapsLayout;

const styles = StyleSheet.create({});
