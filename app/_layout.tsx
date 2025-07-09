import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, LogBox, Platform, Text, ActivityIndicator } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CartProvider } from '@/contexts/CartContext'; // Importamos CartProvider

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  'Warning: Failed prop type',
  'registerError',
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const frameworkReady = useFrameworkReady();

  useEffect(() => {
    async function prepare() {
      try {
        // Esperar a que todo esté listo
        await Promise.all([
          frameworkReady,
          // Aquí puedes agregar más promesas si necesitas cargar otros recursos
        ]);
      } catch (e) {
        console.warn('Error durante la inicialización:', e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#E85D04" />
      </View>
    );
  }

  return (
    <CartProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#fff' },
            headerTitleStyle: {
              fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
            },
            headerTitle: ({ children }) => (
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{children}</Text>
            ),
            animation: Platform.select({
              ios: 'default',
              android: 'fade',
            }),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen 
            name="auth"
            options={{
              animation: Platform.select({
                ios: 'slide_from_bottom',
                android: 'fade',
              }),
            }}
          />
          <Stack.Screen 
            name="vendor"
            options={{
              animation: Platform.select({
                ios: 'slide_from_bottom',
                android: 'fade',
              }),
            }}
          />
          <Stack.Screen 
            name="restaurant/[id]"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="order/[id]"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="order/confirmation"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="review/[id]"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="cart/index"
            options={{
              animation: Platform.select({
                ios: 'slide_from_bottom',
                android: 'fade',
              }),
            }}
          />
        </Stack>
      </View>
    </CartProvider>
  );
}
