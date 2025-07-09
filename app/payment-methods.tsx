import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const nationalBanks = [
  { name: 'Pichincha', key: 'pichincha' },
  { name: 'Produbanco', key: 'produbanco' },
  { name: 'Banco Guayaquil', key: 'guayaquil' },
  { name: 'Banco del Pacífico', key: 'pacifico' },
  { name: 'DeUna', key: 'deuna' },
];

const internationalPlatforms = [
  { name: 'PayPal', key: 'paypal' },
  { name: 'Google Pay', key: 'googlepay' },
  { name: 'Apple Pay', key: 'applepay' },
  { name: 'Stripe', key: 'stripe' },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Métodos de pago nacionales</Text>
      <Text style={styles.sectionSubtitle}>Bancos y transferencias</Text>
      <View style={styles.grid}>
        {nationalBanks.map((bank) => (
          <TouchableOpacity
            key={bank.key}
            style={styles.card}
            onPress={() => router.push('/payment-coming-soon')}
          >
            <Text style={styles.cardText}>{bank.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Métodos internacionales</Text>
      <Text style={styles.sectionSubtitle}>Plataformas globales</Text>
      <View style={styles.grid}>
        {internationalPlatforms.map((platform) => (
          <TouchableOpacity
            key={platform.key}
            style={styles.card}
            onPress={() => router.push('/payment-coming-soon')}
          >
            <Text style={styles.cardText}>{platform.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
