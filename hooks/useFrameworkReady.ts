import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Esperar un pequeño tiempo para evitar parpadeos en Android
        await new Promise(resolve => setTimeout(resolve, Platform.OS === 'android' ? 150 : 50));
        
        // Llamar al callback global si existe
        window.frameworkReady?.();
        
        setIsReady(true);
      } catch (e) {
        console.warn('Error en la inicialización del framework:', e);
        setIsReady(true); // En caso de error, aún permitimos que la app continúe
      }
    }

    prepare();
  }, []);

  return isReady;
}
