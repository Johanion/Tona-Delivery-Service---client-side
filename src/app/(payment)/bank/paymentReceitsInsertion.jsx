import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentReceiptsInsertion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Receipt Upload Page</Text>
      <Text style={styles.subtext}>File found! The error should be gone now.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212'
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10
  }
});

export default PaymentReceiptsInsertion;