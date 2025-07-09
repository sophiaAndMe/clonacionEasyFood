import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Lock, Calendar, Hash } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function CreditCardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const formatCardNumber = (text: string) => {
    // Eliminar espacios y caracteres no numéricos
    const numbers = text.replace(/\D/g, '');
    // Formatear con espacios cada 4 dígitos
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espacios
  };

  const formatExpiryDate = (text: string) => {
    // Eliminar caracteres no numéricos
    const numbers = text.replace(/\D/g, '');
    // Formatear como MM/YY
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    };

    // Validar número de tarjeta (16 dígitos)
    const cardNumbers = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumbers || cardNumbers.length !== 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }

    // Validar nombre
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'El nombre del titular es requerido';
    }

    // Validar fecha de expiración
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Fecha de expiración inválida (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'La tarjeta está vencida';
      }
    }

    // Validar CVV
    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = 'El CVV debe tener 3 dígitos';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleAccept = () => {
    if (validateForm()) {
      Alert.alert(
        'Tarjeta agregada',
        'Los datos de la tarjeta han sido guardados correctamente.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarjeta de Crédito</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Tarjeta Visual */}
        <View style={styles.cardPreview}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <CreditCard size={24} color="#fff" />
              <Text style={styles.cardType}>VISA</Text>
            </View>
            
            <Text style={styles.cardNumber}>
              {formData.cardNumber || '•••• •••• •••• ••••'}
            </Text>
            
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>TITULAR</Text>
                <Text style={styles.cardName}>
                  {formData.cardName || 'NOMBRE APELLIDO'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRA</Text>
                <Text style={styles.cardExpiry}>
                  {formData.expiryDate || 'MM/YY'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Tarjeta</Text>
            <View style={styles.inputContainer}>
              <Hash size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.cardNumber ? styles.inputError : null]}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChangeText={(text) => setFormData({
                  ...formData,
                  cardNumber: formatCardNumber(text)
                })}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
            {errors.cardNumber ? (
              <Text style={styles.errorText}>{errors.cardNumber}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del Titular</Text>
            <TextInput
              style={[styles.input, errors.cardName ? styles.inputError : null]}
              placeholder="Como aparece en la tarjeta"
              value={formData.cardName}
              onChangeText={(text) => setFormData({
                ...formData,
                cardName: text.toUpperCase()
              })}
              autoCapitalize="characters"
            />
            {errors.cardName ? (
              <Text style={styles.errorText}>{errors.cardName}</Text>
            ) : null}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Fecha de Expiración</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.expiryDate ? styles.inputError : null]}
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    expiryDate: formatExpiryDate(text)
                  })}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              {errors.expiryDate ? (
                <Text style={styles.errorText}>{errors.expiryDate}</Text>
              ) : null}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>CVV</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.cvv ? styles.inputError : null]}
                  placeholder="123"
                  value={formData.cvv}
                  onChangeText={(text) => setFormData({
                    ...formData,
                    cvv: text.replace(/\D/g, '').slice(0, 3)
                  })}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
              {errors.cvv ? (
                <Text style={styles.errorText}>{errors.cvv}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.securityNote}>
            <Lock size={16} color="#666" />
            <Text style={styles.securityText}>
              Tus datos están protegidos con encriptación SSL
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={handleAccept}
        >
          <Text style={styles.acceptButtonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardPreview: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  card: {
    width: 300,
    height: 180,
    backgroundColor: '#667eea',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 2,
  },
  cardName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardExpiry: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  form: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  securityText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  acceptButton: {
    backgroundColor: '#E85D04',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
