import { FlatList } from "react-native";
import SkeletonVendorsScreen from "../components/SkeletonVendorsScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const DATA = Array.from({ length: 7 }).map((_, i) => ({
  id: i.toString(),
}));

export default function VendorCardSkeleton() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          renderItem={() => <SkeletonVendorsScreen />}
          contentContainerStyle={{ padding: 16 }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
