import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function VendorLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen 
          name="dashboard"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </View>
  );
}
