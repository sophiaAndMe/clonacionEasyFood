import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LogOut, ChevronRight, Bell, CreditCard, Globe, HelpCircle, Settings, ShieldCheck, User2, Store } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import * as FileSystem from 'expo-file-system';
import { deleteUserAndData, getUserByEmail, updateUserName } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

interface ProfileMenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

function ProfileMenuItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showToggle = false, 
  toggleValue = false, 
  onToggleChange 
}: ProfileMenuItemProps) {
  const IconComponent = icon;
  
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <IconComponent size={20} color="#666" />
      </View>
      
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      
      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: '#D9D9D9', true: '#FFD166' }}
          thumbColor={toggleValue ? '#E85D04' : '#F4F4F4'}
        />
      ) : (
        <ChevronRight size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { toggleLanguage, currentLanguage } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const switchToVendorMode = () => {
    setIsVendorMode(true);
    router.push('/vendor/dashboard');
  };

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        const userData = getUserByEmail(email);
        setUser(userData);
        if (userData?.image_url) setProfileImage(userData.image_url);
        setNameInput(userData?.name || '');
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          const userData = getUserByEmail(email) as any;
          setUser(userData);
          if (userData && userData.image_url) setProfileImage(userData.image_url);
        }
      })();
    }, [])
  );

  useEffect(() => {
    (async () => {
      const dbPath = FileSystem.documentDirectory + 'SQLite/mydatabase.db';
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (fileInfo.exists) {
        console.log('Ruta de la base de datos SQLite:', dbPath);
      } else {
        console.log('No se encontró la base de datos en:', dbPath);
      }
    })();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      // Obtener el email del usuario guardado en AsyncStorage
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        Alert.alert('Error', 'No se encontró el usuario actual.');
        return;
      }
      const user = getUserByEmail(email);
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

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      // Actualiza la base de datos con la nueva imagen
      if (user) {
        // Actualiza el campo image_url en la tabla users
        // Si tienes una función updateUserImage, úsala. Si no, puedes hacer:
        const db = require('expo-sqlite').openDatabaseSync('mydatabase.db');
        db.runSync('UPDATE users SET image_url = ? WHERE id = ?', [uri, user.id]);
        setUser({ ...user, image_url: uri });
      }
    }
  };

  const handleEditName = () => {
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    if (user) {
      updateUserName(user.id, nameInput);
      setUser({ ...user, name: nameInput });
      setEditingName(false);
      Alert.alert('Éxito', 'Nombre actualizado correctamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/login/fotoperfil.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Cuenta</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={User2}
            title="Información Personal"
            subtitle="Gestiona tus datos personales"
            onPress={() => router.push('/profile-details')}
          />
          
          <ProfileMenuItem
            icon={CreditCard}
            title="Métodos de Pago"
            subtitle="Agregar o editar formas de pago"
            onPress={() => router.push('/payment-methods')}
          />

          <ProfileMenuItem
            icon={Bell}
            title="Notificaciones"
            subtitle="Configurar alertas y avisos"
            showToggle
            toggleValue={notificationsEnabled}
            onToggleChange={setNotificationsEnabled}
            onPress={() => console.log('Notifications')}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Preferencias</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={Settings}
            title="Configuración"
            subtitle="Personaliza tu experiencia"
            onPress={() => router.push('/payment-methods')}
          />

          <ProfileMenuItem
            icon={Globe}
            title="Idioma"
            subtitle={currentLanguage === 'es' ? 'Español' : 'English'}
            onPress={toggleLanguage}
          />

          <ProfileMenuItem
            icon={ShieldCheck}
            title="Privacidad y Seguridad"
            subtitle="Gestiona tu privacidad"
            onPress={() => console.log('Privacy')}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Ayuda y Soporte</Text>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            icon={HelpCircle}
            title="Centro de Ayuda"
            subtitle="Preguntas frecuentes y soporte"
            onPress={() => console.log('Help Center')}
          />

          <ProfileMenuItem
            icon={Store}
            title="Modo Restaurante"
            subtitle="¿Tienes un restaurante? Administra tu negocio"
            onPress={switchToVendorMode}
          />
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleDeleteAccount}
        >
          <LogOut size={20} color="#E53935" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  menuSection: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  vendorSection: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  vendorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vendorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  vendorButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  vendorButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    width: 200,
    textAlign: 'center',
    color: '#333',
  },
});