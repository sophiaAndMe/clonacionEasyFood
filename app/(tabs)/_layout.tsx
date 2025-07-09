import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, LogBox, Platform, Text, ActivityIndicator } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Home, Search, Map, ShoppingBag, User } from 'lucide-react-native';

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  'Warning: Failed prop type',
  'registerError',
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

export default function TabsLayout() {
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
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#E85D04',
          tabBarInactiveTintColor: '#777',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#eee',
            height: Platform.OS === 'ios' ? 90 : 60,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Mapa',
            tabBarIcon: ({ color }) => <Map size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Pedidos',
            tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
