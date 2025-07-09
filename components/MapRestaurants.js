// components/MapRestaurants.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mockRestaurants } from '../data/mockData';
import { geocodeAddress } from '../utils/geocode';

const { width, height } = Dimensions.get('window');

export default function MapRestaurants() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarkers() {
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
            return null;
          }
        })
      );
      setMarkers(results.filter(Boolean));
      setLoading(false);
    }
    fetchMarkers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: markers[0]?.lat || -0.220164,
          longitude: markers[0]?.lng || -78.512327,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            title={marker.name}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
});
