import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { mockRestaurants } from '../../data/mockData';
import { geocodeAddress } from '../../utils/geocode';

const { width } = Dimensions.get('window');

interface MarkerType {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export default function MapTestScreen() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMarkers() {
      try {
        const results = await Promise.all(
          mockRestaurants.map(async (rest) => {
            try {
              const coords = await geocodeAddress(rest.address);
              return {
                id: rest.id,
                name: rest.name,
                lat: coords.lat,
                lng: coords.lng,
              };
            } catch (e) {
              console.error(`Error geocodificando ${rest.name}:`, e);
              return null;
            }
          })
        );
        if (!isMounted) return;
        const validMarkers = results.filter(Boolean) as MarkerType[];
        setMarkers(validMarkers);
        if (validMarkers.length === 0) {
          setError('No se pudieron cargar las ubicaciones de los restaurantes');
        }
      } catch (e) {
        if (isMounted) {
          console.error('Error cargando marcadores:', e);
          setError('Error al cargar el mapa');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchMarkers();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E85D04" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Construir la URL de Google Maps con los marcadores
  const baseUrl = 'https://www.google.com/maps/embed/v1/view';
  const apiKey = 'AIzaSyAHDnMOx1QWZvmq1ZaVpYK6JTE9G9v-a3A';
  // Centrar en Quito o el primer marcador
  const center = markers.length > 0 ? `${markers[0].lat},${markers[0].lng}` : '-0.1807,-78.4678';
  const zoom = 12;
  // NOTA: Google Maps Embed API no permite múltiples marcadores, pero puedes mostrar el centro
  const mapUrl = `${baseUrl}?key=${apiKey}&center=${center}&zoom=${zoom}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: mapUrl }}
        style={styles.mapWebView}
        javaScriptEnabled
        domStorageEnabled
      />
      <Text style={styles.title}>Restaurantes encontrados:</Text>
      {markers.map((marker) => (
        <View key={marker.id} style={styles.markerBox}>
          <Text style={styles.markerTitle}>{marker.name}</Text>
          <Text style={styles.markerCoords}>
            Lat: {marker.lat}, Lng: {marker.lng}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  mapWebView: {
    width: width - 20,
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#E85D04',
  },
  markerBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: width - 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  markerCoords: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#E85D04',
    textAlign: 'center',
    marginHorizontal: 32,
  },
});