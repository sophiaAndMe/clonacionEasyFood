// utils/geocode.js
import Constants from 'expo-constants';

// Coordenadas por defecto (Quito, Ecuador)
const DEFAULT_LOCATION = {
  lat: -0.1807,
  lng: -78.4678
};

// API Key de respaldo en caso de que falle la configuración
const BACKUP_API_KEY = 'AIzaSyAHDnMOx1QWZvmq1ZaVpYK6JTE9G9v-a3A';
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || BACKUP_API_KEY;

export async function geocodeAddress(address) {
  try {
    if (!address) {
      console.warn('Dirección no proporcionada, usando ubicación por defecto');
      return DEFAULT_LOCATION;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.warn(`Geocodificación fallida para ${address}, usando ubicación por defecto`);
      return DEFAULT_LOCATION;
    }
  } catch (error) {
    console.error('Error en geocodificación:', error);
    return DEFAULT_LOCATION;
  }
}
