import React, { useState, useEffect } from "react"; // 1. Added useEffect
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import  startChapaPayment from "./paymentService";

const ChapaScreen = () => {
  const [loading, setLoading] = useState(false);

  // 2. Define the payment trigger logic
  const handleAutomaticPayment = async () => {
    setLoading(true);
    console.log("ssssssssssssssssssssssssssssssssssssssssssssssssereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    try {
      // Note: Passing hardcoded '100' and 'cart' for test
      const result = await startChapaPayment(100,);
      if(result){
        setLoading(false)
      }
      console.log("Payment Window Closed:", result);
    } catch (err) {
      setLoading(false)
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. This runs exactly ONCE when the screen opens
  useEffect(() => {
    handleAutomaticPayment();
  }, []); // Empty array [] means "run on mount"

  return (
    <View style={styles.container}>
      {/* 4. We only show the loader since it triggers automatically */}
      <View style={styles.loadingCard}>
        <ActivityIndicator size="large" color="#ff3b5c" />
        <Text style={styles.loadingText}>Initializing Payment...</Text>
        <Text style={styles.loadingSubText}>Opening Chapa Secure Gateway</Text>
      </View>

      {/* The Full Overlay Loader (Optional if you use the card above) */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff3b5c" />
        </View>
      )}
    </View>
  );
};

export default ChapaScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingCard: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '80%',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 8,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});