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
import Onboarding from "react-native-onboarding-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

const { width } = Dimensions.get("window");

// Professional Delivery Palette
const THEME = {
  primary: "#FF8C00", // Energetic Orange
  primaryDark: "#E67E00",
  secondary: "#2D2D2D", // Charcoal Professional
  bgLight: "#FFF5EB", // Soft Peach Tint
  textDark: "#1A1A1B",
  textMuted: "#707070",
  white: "#FFFFFF",
  gradient: ["#FFDBB4", "#FFE6CC", "#FFE6CC", "#FFEFD6", "#FFF5EB", "#FFFFFF"],
};

const Slides = [
  {
    title: "Fastest Delivery",
    subtitle:
      "Get your items delivered from your favorite local shops in record time.",
    icon: "shipping-fast",
    colors: ["#FFDBB4", "#FFE6CC"],
  },
  {
    title: "Real-time Tracking",
    subtitle:
      "Precise map tracking from the moment you order until it reaches your door.",
    icon: "map-marked-alt",
    colors: ["#FFE6CC", "#FFEFD6"],
  },
  {
    title: "Safe & Secure",
    subtitle:
      "Trusted handlers and secure digital payments for your peace of mind.",
    icon: "shield-alt",
    colors: ["#FFEFD6", "#FFFFFF"],
  },
];

export default function SignUp() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [logLoading, setLogLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);

  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/(tabs)");
  }, [session]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenOnboardinggg");
      if (hasSeen === "true") setShowOnboarding(false);
    };
    checkOnboarding();
  }, []);

  const signUpWithPhone = async () => {
    if (!phone || !password || !fullName) {
      Alert.alert("Missing Fields", "Please complete all fields to continue.");
      return;
    }
    setLogLoading(true);
    const email = `${phone}tona@gmail.com`;
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      await supabase.from("profile").insert({
        id: data.user.id,
        email: data.user.email,
        phone_number: phone,
        full_name: fullName,
      });
    } catch (err) {
      Alert.alert("Sign-up Error", err.message);
    } finally {
      setLogLoading(false);
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboardinggg", "true");
    setShowOnboarding(false);
  };

  const OnboardingPage = ({ item }) => (
    <View style={styles.slidePage}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={item.icon} size={70} color={THEME.primary} />
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}}>
          <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
              colors={THEME.gradient}
              style={StyleSheet.absoluteFillObject}
            />
            <Onboarding
              pages={Slides.map((s) => ({
                backgroundColor: "transparent",
                image: <OnboardingPage item={s} />,
                title: "",
                subtitle: "",
              }))}
              onDone={handleDone}
              onSkip={handleDone}
              bottomBarHighlight={false}
              controlStatusBar={false}
              DoneButtonComponent={({ ...props }) => (
                <TouchableOpacity {...props} style={styles.doneBtn}>
                  <Text style={styles.doneBtnText}>Get Started</Text>
                </TouchableOpacity>
              )}
              NextButtonComponent={({ ...props }) => (
                <View style={styles.nextBtn}>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={THEME.white}
                    {...props}
                  />
                </View>
              )}
              DotComponent={({ selected }) => (
                <View
                  style={[
                    styles.dot,
                    {
                      width: selected ? 24 : 8,
                      backgroundColor: selected ? THEME.primary : "#CCC",
                    },
                  ]}
                />
              )}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.white }}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient
          colors={THEME.gradient}
          style={StyleSheet.absoluteFillObject}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.authHeader}>
              <View style={styles.logoBadge}>
                <FontAwesome5
                  name="shipping-fast"
                  size={24}
                  color={THEME.white}
                />
              </View>
              <Text style={styles.brandName}>Tona</Text>
              <Text style={styles.authTitle}>Create Account</Text>
              <Text style={styles.authSubtitle}>
                Sign up to get your items moving
              </Text>
            </View>

            <View style={styles.card}>
              <InputGroup
                label="Full Name"
                icon="person-outline"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Name"
                isFocused={focusedInput === "name"}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
              />

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
                  value={phone.replace("+251", "")}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(t) =>
                    setPhone("+251" + t.replace(/[^0-9]/g, "").slice(0, 9))
                  }
                />
              </View>

              <InputGroup
                label="Password"
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secure
                isFocused={focusedInput === "pass"}
                onFocus={() => setFocusedInput("pass")}
                onBlur={() => setFocusedInput(null)}
              />

              <TouchableOpacity
                style={[styles.mainBtn, logLoading && { opacity: 0.7 }]}
                onPress={signUpWithPhone}
                disabled={logLoading}
              >
                {logLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.mainBtnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/log-in")}
              style={styles.footerLink}
            >
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerHighlight}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const InputGroup = ({
  icon,
  value,
  onChangeText,
  placeholder,
  secure,
  isFocused,
  onFocus,
  onBlur,
}) => (
  <View style={[styles.inputWrapper, isFocused && styles.inputFocused]}>
    <Ionicons
      name={icon}
      size={20}
      color={isFocused ? THEME.primary : THEME.textMuted}
      style={styles.inputIcon}
    />
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secure}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholderTextColor="#9CA3AF"
    />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  slidePage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  iconContainer: { marginBottom: 30, transform: [{ scale: 1.1 }] },
  slideTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: THEME.secondary,
    textAlign: "center",
    marginBottom: 15,
  },
  slideSubtitle: {
    fontSize: 17,
    color: THEME.textMuted,
    textAlign: "center",
    lineHeight: 26,
  },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  nextBtn: {
    backgroundColor: THEME.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  doneBtn: {
    marginRight: 20,
    backgroundColor: THEME.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  doneBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 },

  scrollContainer: { padding: 24, paddingTop: 40 },
  authHeader: { marginBottom: 35, alignItems: "center" },
  logoBadge: {
    width: 50,
    height: 50,
    backgroundColor: THEME.primary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  brandName: {
    fontSize: 38,
    fontWeight: "900",
    color: THEME.secondary,
    letterSpacing: -1,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: THEME.secondary,
    marginTop: 5,
  },
  authSubtitle: { fontSize: 15, color: THEME.textMuted, marginTop: 4 },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 32,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    borderWeight: 1,
    borderColor: "#FFF",
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
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  inputFocused: { borderColor: THEME.primary, shadowOpacity: 0.1 },
  inputIcon: { marginRight: 12 },
  countryCode: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.secondary,
    marginRight: 8,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: THEME.secondary,
    fontWeight: "500",
  },

  mainBtn: {
    backgroundColor: THEME.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  mainBtnText: { color: THEME.white, fontSize: 18, fontWeight: "800" },
  footerLink: { marginTop: 25, alignItems: "center" },
  footerText: { fontSize: 15, color: THEME.textMuted },
  footerHighlight: { color: THEME.primary, fontWeight: "800" },
});
