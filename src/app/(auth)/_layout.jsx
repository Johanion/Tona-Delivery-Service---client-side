import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";

const AuthLayout = () => {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    }
  }, [session]);

  if (authLoading) {
    return (
      <LinearGradient
        colors={["#FFDBB4", "#FFE6CC"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#239BA7" />
      </LinearGradient>
    );
  }
  return (
    <Stack>
      <Stack.Screen name="log-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
