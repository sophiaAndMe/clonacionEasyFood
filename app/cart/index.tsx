import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Minus, Plus, CreditCard, Truck, Clock } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockRestaurants } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { createOrder, updateOrderStatus } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { items, addItem, removeItem, clearCart, total, isLoading } = useCart();
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Calcular totales
  const subtotal = total;
  const deliveryFee = deliveryOption === 'delivery' ? 2.99 : 0;
  const serviceFee = 1.50;
  const finalTotal = subtotal + deliveryFee + serviceFee;

  // Obtener info del restaurante real
  const restaurant = items.length > 0
    ? mockRestaurants.find(r => r.id == (items[0].restaurant_id || items[0].restaurantId))
    : null;

  // Handlers de cantidad
  const handleIncreaseQuantity = async (item: any) => {
    if (updatingItemId || isSubmitting) {
      console.log('handleIncreaseQuantity - Operación en progreso, ignorando');
      return;
    }
    
    setUpdatingItemId(item.id);
    try {
      console.log('handleIncreaseQuantity - Aumentando cantidad para item:', item);
      await addItem(item, 1, item.notes || '');
      console.log('handleIncreaseQuantity - Cantidad aumentada exitosamente');
    } catch (error) {
      console.error('handleIncreaseQuantity - Error:', error);
      Alert.alert('Error', 'No se pudo aumentar la cantidad del producto');
    } finally {
      setUpdatingItemId(null);
    }
  };
  
  const handleDecreaseQuantity = async (item: any) => {
    if (updatingItemId || isSubmitting) {
      console.log('handleDecreaseQuantity - Operación en progreso, ignorando');
      return;
    }
    
    setUpdatingItemId(item.id);
    try {
      console.log('handleDecreaseQuantity - Disminuyendo cantidad para item:', item);
      
      if (item.quantity === 1) {
        console.log('handleDecreaseQuantity - Cantidad es 1, eliminando item');
        await removeItem(item.id);
        console.log('handleDecreaseQuantity - Item eliminado exitosamente');
      } else {
        console.log('handleDecreaseQuantity - Disminuyendo cantidad en 1');
        await addItem(item, -1, item.notes || '');
        console.log('handleDecreaseQuantity - Cantidad disminuida exitosamente');
      }
    } catch (error) {
      console.error('handleDecreaseQuantity - Error:', error);
      Alert.alert('Error', 'No se pudo disminuir la cantidad del producto');
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Checkout (puedes adaptar createOrder según tu lógica actual)
  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Tu carrito está vacío');
      return;
    }
    setIsSubmitting(true);
    try {
      // Obtener el userId real
      const email = await AsyncStorage.getItem('userEmail');
      let userId = '1';
      if (email) {
        const user = require('@/utils/database').getUserByEmail(email);
        if (user && user.id) userId = user.id;
      }
      // LOGS DE DEPURACIÓN
      console.log('Checkout: userId', userId, 'items', items);
      // Crear la orden y obtener el ID
      const deliveryAddress = 'Dirección de ejemplo';
      const customerName = 'Nombre de ejemplo';
      const customerPhone = '0999999999';
      const orderId = await createOrder(
        userId,
        deliveryAddress,
        customerName,
        customerPhone
      );
      // No limpiar el carrito aquí, la base de datos lo hace tras crear la orden
      // Programar actualización de estado a 'completed' en 15 segundos
      if (orderId) {
        setTimeout(() => {
          updateOrderStatus(orderId, 'completed');
        }, 15000);
        // Emitir evento para refrescar pedidos
        DeviceEventEmitter.emit('refreshOrders');
      }
      router.push('/order/confirmation');
    } catch (error) {
      // Mostrar el error real
      let errorMsg = 'Ocurrió un error al procesar tu pedido.';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMsg = (error as any).message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }
      console.log('Error real al crear orden:', error);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size={'large'} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('carrito')}</Text>
      </View>

      {items.length > 0 ? (
        <>
          <ScrollView style={styles.content}>
            {restaurant && (
              <View style={styles.restaurantInfo}>
                <Image
                  source={typeof restaurant.image === 'string' ? { uri: restaurant.image } : restaurant.image}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantDetails}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantLocation}>
                    <MapPin size={14} color="#666" />
                    <Text style={styles.restaurantDistance}>
                      {restaurant.distance}km {t('ubicación')}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('productos')}</Text>
              {items.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Image
                    source={typeof item.image_url === 'string' ? { uri: item.image_url } : item.image_url}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleDecreaseQuantity(item)}
                      disabled={updatingItemId === item.id}
                    >
                      <Minus size={16} color="#E85D04" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleIncreaseQuantity(item)}
                      disabled={updatingItemId === item.id}
                    >
                      <Plus size={16} color="#E85D04" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('opciones de envío')}</Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    deliveryOption === 'delivery' && styles.selectedOption
                  ]}
                  onPress={() => setDeliveryOption('delivery')}
                >
                  <Truck 
                    size={20} 
                    color={deliveryOption === 'delivery' ? '#E85D04' : '#666'} 
                  />
                  <View style={styles.optionTextContainer}>
                    <Text 
                      style={[
                        styles.optionTitle,
                        deliveryOption === 'delivery' && styles.selectedOptionText
                      ]}
                    >
                      {t('cart.delivery')}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {t('tiempo de envío', { time: '30-45' })}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    deliveryOption === 'pickup' && styles.selectedOption
                  ]}
                  onPress={() => setDeliveryOption('pickup')}
                >
                  <Clock 
                    size={20} 
                    color={deliveryOption === 'pickup' ? '#E85D04' : '#666'} 
                  />
                  <View style={styles.optionTextContainer}>
                    <Text 
                      style={[
                        styles.optionTitle,
                        deliveryOption === 'pickup' && styles.selectedOptionText
                      ]}
                    >
                      {t('cart.pickup')}
                    </Text>
                    <Text style={styles.optionSubtitle}>
                      {t('tiempo de preparación', { time: '15-20' })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('método de pago')}</Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    paymentMethod === 'card' && styles.selectedOption
                  ]}
                  onPress={() => {
                    setPaymentMethod('card');
                    router.push('/cart/credit-card' as any);
                  }}
                >
                  <CreditCard 
                    size={20} 
                    color={paymentMethod === 'card' ? '#E85D04' : '#666'} 
                  />
                  <Text 
                    style={[
                      styles.optionTitle,
                      paymentMethod === 'card' && styles.selectedOptionText
                    ]}
                  >
                    {t('tarjeta de crédito')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    paymentMethod === 'cash' && styles.selectedOption
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Text 
                    style={[
                      styles.cashIcon,
                      paymentMethod === 'cash' && styles.selectedCashIcon
                    ]}
                  >
                    $
                  </Text>
                  <Text 
                    style={[
                      styles.optionTitle,
                      paymentMethod === 'cash' && styles.selectedOptionText
                    ]}
                  >
                    {t('efectivo')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resumen')}</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('envio')}</Text>
                <Text style={styles.summaryValue}>
                  {deliveryOption === 'pickup' 
                    ? t('cart.free') 
                    : `$${deliveryFee.toFixed(2)}`}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('servicio')}</Text>
                <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>{t('total')}</Text>
                <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.checkoutButton, isSubmitting && styles.disabledButton]}
              onPress={handleCheckout}
              disabled={isSubmitting}
            >
              <Text style={styles.checkoutButtonText}>
                {isSubmitting ? t('Procesando...') : t('Ordenar')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png' }}
            style={styles.emptyCartImage}
          />
          <Text style={styles.emptyCartTitle}>¡Tu carrito está vacío!</Text>
          <Text style={styles.emptyCartSubtitle}>Agrega productos deliciosos y aparecerán aquí. ¡Explora restaurantes y disfruta!</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.browseButtonText}>{t('buscar restaurantes')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 40, // To offset the back button and center the title
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  restaurantDetails: {
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restaurantLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantDistance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: '#E85D04',
    backgroundColor: '#FFF0E6',
  },
  optionTextContainer: {
    marginLeft: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedOptionText: {
    color: '#E85D04',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  cashIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  selectedCashIcon: {
    color: '#E85D04',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  checkoutButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});