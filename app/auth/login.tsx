import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import GoogleIcon from '@/components/auth/GoogleIcon';
import { registerUser, loginUser, getUserByEmail, deleteUserAndData } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir tipo para el usuario
interface User {
  id: string;
  email: string;
  password: string;
  // Puedes agregar más campos si los necesitas
}

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Advertencia', 'Ingrese usuario y contraseña');
      return;
    }
    setIsSubmitting(true);
    if (isLogin) {
      // Lógica de login
      try {
        const user = await loginUser(email, password);
        // Limpiar carrito al iniciar sesión
        await AsyncStorage.removeItem('cart');
        await AsyncStorage.setItem('userEmail', email);
        router.push('/(tabs)');
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Ocurrió un error al iniciar sesión.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Lógica de registro
      try {
        await registerUser({ email, password, role: 'customer' });
        // Limpiar carrito al crear cuenta nueva
        await AsyncStorage.removeItem('cart');
        Alert.alert('Éxito', 'Cuenta creada, ahora puede iniciar sesión');
        setIsLogin(true);
      } catch (e: any) {
        Alert.alert('Error', e.message || 'No se pudo crear la cuenta. ¿Ya existe ese correo?');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Ejemplo de uso en tu pantalla de perfil:
  // Supón que tienes el email guardado en AsyncStorage como 'userEmail'
  const handleDeleteAccount = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        Alert.alert('Error', 'No se encontró el usuario actual.');
        return;
      }
      const user = getUserByEmail(email) as User | null;
      if (!user) {
        Alert.alert('Error', 'No se encontró el usuario en la base de datos.');
        return;
      }
      deleteUserAndData(user.id);
      await AsyncStorage.removeItem('userEmail');
      Alert.alert('Cuenta eliminada', 'Tu cuenta y todos tus datos han sido eliminados.');
      router.replace('/auth/login');
    } catch (e) {
      Alert.alert('Error', 'No se pudo eliminar la cuenta.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/login/Logo EASYFOOD.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese su nombre"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? (isLogin ? 'Ingresando...' : 'Registrando...') : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => console.log('Google Sign In')}
          >
            <GoogleIcon size={20} />
            <Text style={styles.googleButtonText}>
              {isLogin ? 'Iniciar Sesión' : 'Continuar'} con Google
            </Text>
          </TouchableOpacity>

          <View style={styles.footerText}>
            <Text style={styles.footerLabel}>
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.footerLink}>
                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
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
  header: {
    paddingTop: 55,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
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
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#E85D04',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  dividerText: {
    color: '#666',
    marginHorizontal: 16,
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    gap: 12,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  footerLabel: {
    color: '#666',
    fontSize: 16,
  },
  footerLink: {
    color: '#E85D04',
    fontSize: 16,
    fontWeight: '600',
  },
});