import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const ErrorState = ({ 
  title = "Connection Interrupted", 
  message = "We couldn't reach the server. Please check your internet and try again.", 
  onRetry 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      // We await the retry function in case it's an async fetch
      await onRetry();
    } finally {
      // Small delay so the user sees the transition
      setTimeout(() => setIsRetrying(false), 800);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- AESTHETIC VISUAL --- */}
      <View style={styles.illustrationContainer}>
        <Image
          source="https://illustrations.popsy.co/amber/falling.svg" 
          style={styles.image}
          contentFit="contain"
          transition={500}
        />
        <View style={styles.shadowBase} />
      </View>

      {/* --- TEXT AREA --- */}
      <View style={styles.textGroup}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      {/* --- RETRY ACTION --- */}
      <TouchableOpacity 
        onPress={handleRetry} 
        disabled={isRetrying}
        activeOpacity={0.8}
        style={styles.buttonContainer}
      >
        <LinearGradient
          colors={['#FF8C00', '#FF5F00']}
          style={styles.gradientButton}
        >
          {isRetrying ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Feather name="rotate-cw" size={18} color="#FFF" style={styles.icon} />
              <Text style={styles.buttonText}>Try Again</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backLink}
        onPress={() => {/* Navigation logic to go back */}}
      >
        <Text style={styles.backText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  illustrationContainer: {
    width: width * 0.7,
    height: width * 0.5,
    marginBottom: 40,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  shadowBase: {
    width: 100,
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    marginTop: -10,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: 10,
  },
  backLink: {
    marginTop: 25,
  },
  backText: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default ErrorState;