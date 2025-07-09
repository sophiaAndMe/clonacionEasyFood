import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface FormData {
  restaurantName: string;
  responsableName: string;
  email: string;
  phone: string;
  address: string;
  ruc: string;
}

export default function RestaurantRegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    restaurantName: '',
    responsableName: '',
    email: '',
    phone: '',
    address: '',
    ruc: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.restaurantName.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del restaurante');
      return false;
    }
    if (!formData.responsableName.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del responsable');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      Alert.alert('Error', 'Por favor ingrese un número de teléfono válido');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Por favor ingrese la dirección del local');
      return false;
    }
    if (!formData.ruc.trim() || formData.ruc.length !== 13) {
      Alert.alert('Error', 'Por favor ingrese un RUC válido de 13 dígitos');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Datos del formulario:', formData);
      
      // Asegurarnos de que la navegación sea consistente
      await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño retraso para estabilidad
      router.replace('/(tabs)');
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace('/vendor/dashboard');
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al registrar el restaurante. Por favor intente nuevamente.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Volver"
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registro de Restaurante</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/login/Logo EASYFOOD.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Restaurante</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre del restaurante"
              value={formData.restaurantName}
              onChangeText={(value) => handleInputChange('restaurantName', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Responsable</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo del responsable"
              value={formData.responsableName}
              onChangeText={(value) => handleInputChange('responsableName', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico Empresarial</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@restaurante.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono de Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el número de teléfono"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección del Local</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingrese la dirección completa"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RUC</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el RUC"
              value={formData.ruc}
              onChangeText={(value) => handleInputChange('ruc', value)}
              keyboardType="numeric"
              maxLength={13}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            accessibilityLabel="Registrar restaurante"
          >
            <Text style={styles.submitButtonText}>Registrar Restaurante</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { Image } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 5,
  },
  logo: {
    width: 265,
    height: 110,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#E85D04',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
