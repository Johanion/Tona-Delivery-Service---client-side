import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#FF8C00", // Consistent Action Orange
  secondary: "#2D2D2D", // Professional Charcoal
  textMuted: "#707070",
  white: "#FFFFFF",
  gradient: ["#FFDBB4", "#FFE6CC", "#FFE6CC", "#FFEFD6", "#FFF5EB", "#FFFFFF"],
};

export default function LogIn() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [logLoading, setLogLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/(tabs)");
  }, [session]);

  const signInWithPhone = async () => {
    if (!phone || !password) {
      Alert.alert("Missing Info", "Please enter both Phone and password.");
      return;
    }
    setLogLoading(true);
    const email = `${phone}tona@gmail.com`;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      Alert.alert("Sign-in Failed", err.message);
    } finally {
      setLogLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.white }}>
        <StatusBar barStyle="dark-content" />

        {/* Consistent Brand Gradient */}
        <LinearGradient
          colors={THEME.gradient}
          style={StyleSheet.absoluteFillObject}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section with Animated-style Icon */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <FontAwesome5
                  name="shipping-fast"
                  size={28}
                  color={THEME.white}
                />
              </View>
              <Text style={styles.brandName}>Tona</Text>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to get your items moving
              </Text>
            </View>

            {/* Glass-morphism Login Card */}
            <View style={styles.card}>
              {/* Phone Input */}
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === "phone" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={
                    focusedInput === "phone" ? THEME.primary : THEME.textMuted
                  }
                />
                <Text style={styles.countryCode}>+251</Text>
                <TextInput
                  placeholder="912345678"
                  placeholderTextColor="#9CA3AF"
                  style={styles.textInput}
                  keyboardType="phone-pad"
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  value={phone.replace("+251", "")}
                  onChangeText={(t) =>
                    setPhone("+251" + t.replace(/[^0-9]/g, "").slice(0, 9))
                  }
                />
              </View>

              {/* Password Input */}
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === "pass" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    focusedInput === "pass" ? THEME.primary : THEME.textMuted
                  }
                />
                <TextInput
                  style={[styles.textInput, { marginLeft: 12 }]}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput("pass")}
                  onBlur={() => setFocusedInput(null)}
                  secureTextEntry
                />
              </View>

              {/* Main Action Button */}
              <TouchableOpacity
                style={[styles.mainBtn, logLoading && styles.btnDisabled]}
                onPress={signInWithPhone}
                disabled={logLoading}
              >
                {logLoading ? (
                  <ActivityIndicator color={THEME.white} />
                ) : (
                  <Text style={styles.mainBtnText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Forgot Password Link */}
              {/* <TouchableOpacity
                onPress={() => router.push("../(reset)/forget-password")}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity> */}
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>New here?</Text>
              <TouchableOpacity onPress={() => router.push("/sign-up")}>
                <Text style={styles.footerHighlight}> Create an account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: THEME.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "900",
    color: THEME.secondary,
    letterSpacing: -1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.secondary,
    marginTop: 10,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: THEME.textMuted,
    marginTop: 6,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Glass effect
    borderRadius: 32,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 60,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  inputFocused: {
    borderColor: THEME.primary,
    shadowOpacity: 0.08,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.secondary,
    marginHorizontal: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: THEME.secondary,
    fontWeight: "500",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 25,
    marginTop: -4,
  },
  forgotText: {
    color: THEME.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  mainBtn: {
    backgroundColor: THEME.primary,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 20
  },
  btnDisabled: {
    backgroundColor: "#D1D5DB",
  },
  mainBtnText: {
    color: THEME.white,
    fontSize: 18,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },
  footerText: {
    fontSize: 15,
    color: THEME.textMuted,
  },
  footerHighlight: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.primary,
  },
});
