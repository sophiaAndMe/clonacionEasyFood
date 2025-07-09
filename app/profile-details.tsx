import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail, updateUserName } from '@/utils/database';

export default function ProfileDetailsScreen() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        const userData = getUserByEmail(email);
        setUser(userData);
        setName(userData?.name || '');
      }
    })();
  }, []);

  // Sincroniza el nombre en Perfil al volver a esta pantalla
  useEffect(() => {
    const unsubscribe = () => {
      (async () => {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          const userData = getUserByEmail(email);
          setUser(userData);
          setName(userData?.name || '');
        }
      })();
    };
    // Si usas React Navigation, sería navigation.addListener('focus', unsubscribe)
    // Aquí, para Expo Router, puedes usar el evento de focus si lo tienes disponible
    // Si no, puedes forzar la recarga del perfil desde la pantalla principal después de editar
    return unsubscribe;
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    if (user) {
      updateUserName(user.id, name);
      setUser({ ...user, name });
      setEditing(false);
      Alert.alert('Éxito', 'Nombre actualizado correctamente.');
    }
  };

  function handlePickImage() {
    if (!user) return;
    import('expo-image-picker').then(async ImagePicker => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const db = require('expo-sqlite').openDatabaseSync('mydatabase.db');
        db.runSync('UPDATE users SET image_url = ? WHERE id = ?', [uri, user.id]);
        setUser({ ...user, image_url: uri });
        Alert.alert('Éxito', 'Foto de perfil actualizada.');
      }
    });
  }

  return (
    <View style={styles.container}>
      <Image
        source={user?.image_url ? { uri: user.image_url } : require("../assets/login/fotoperfil.png")}
        style={styles.profileImage}
      />
      {editing ? (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre"
        />
      ) : (
        <Text style={styles.profileName}>{user?.name || 'Usuario'}</Text>
      )}
      <Text style={styles.profileEmail}>{user?.email || ''}</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <Text style={styles.editButtonText}>{editing ? 'Guardar' : 'Editar Nombre'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handlePickImage}
        >
          <Text style={styles.editButtonText}>Editar Foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
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
  editButton: {
    marginTop: 16,
    backgroundColor: '#FFD166',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
