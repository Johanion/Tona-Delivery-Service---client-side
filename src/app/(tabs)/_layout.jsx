import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TabsLayout from "../../providers/TabsLayout.jsx"; // your existing TabsLayout

export default function RootLayout() {
  // 3. Everything good → show tabs
   return (
    <SafeAreaProvider>
      <TabsLayout />
    </SafeAreaProvider>
  );

}