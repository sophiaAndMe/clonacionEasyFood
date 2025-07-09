import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function PaymentComingSoonScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/coming-soon.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>¡Próximamente!</Text>
      <Text style={styles.subtitle}>Esta funcionalidad estará disponible en el futuro.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E85D04',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
