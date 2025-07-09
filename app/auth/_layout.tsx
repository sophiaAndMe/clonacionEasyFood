import { Stack } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useEffect } from 'react';

export default function AuthLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Los warnings ya están manejados en el layout principal
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
          headerTitle: ({ children }) => (
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{children}</Text>
          ),
          presentation: Platform.select({
            ios: 'modal',
            android: 'transparentModal',
          }),
          animationTypeForReplace: Platform.OS === 'android' ? 'pop' : 'push',
        }}
      >
        <Stack.Screen 
          name="login"
          options={{
            title: 'Iniciar Sesión',
          }}
        />
        <Stack.Screen 
          name="restaurant-login"
          options={{
            title: 'Acceso Restaurantes',
          }}
        />
        <Stack.Screen 
          name="restaurant-register"
          options={{
            title: 'Registro Restaurante',
          }}
        />
      </Stack>
    </View>
  );
}
