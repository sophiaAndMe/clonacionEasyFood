import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { getOrderDetails } from '@/utils/database';
import { mockRestaurants } from '@/data/mockData';

interface OrderDetails {
  id: number;
  user_id: number;
  restaurant_id: number;
  status: string;
  total_amount: number;
  delivery_fee: number;
  service_fee: number;
  created_at: string;
  delivery_address: string;
  customer_name: string;
  customer_phone: string;
  items: Array<{
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    name: string;
    image_url: string;
    notes?: string;
  }>;
}

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Obtener el ID del pedido de los parámetros o generar uno aleatorio para pruebas
  const orderId = params.orderId ? Number(params.orderId) : Math.floor(10000 + Math.random() * 90000);
  const orderNumber = "EF" + orderId;
  const estimatedTime = "30-45";

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        if (params.orderId) {
          // Si tenemos un ID de pedido real, cargamos los detalles desde la base de datos
          const details = await getOrderDetails(Number(params.orderId));
          setOrderDetails(details);
        } else {
          // Para pruebas, usamos datos del parámetro o valores por defecto
          setOrderDetails({
            id: orderId,
            user_id: 1,
            restaurant_id: 1,
            status: 'preparing',
            total_amount: Number(params.total) || 41.45,
            delivery_fee: Number(params.deliveryFee) || 2.99,
            service_fee: Number(params.serviceFee) || 1.50,
            created_at: new Date().toISOString(),
            delivery_address: 'Dirección de prueba',
            customer_name: 'Cliente de prueba',
            customer_phone: '0987654321',
            items: []
          });
        }
      } catch (error) {
        console.error('Error loading order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrderDetails();
  }, [params.orderId]);

  // Encontrar información del restaurante
  const restaurant = orderDetails?.restaurant_id
    ? mockRestaurants.find(r => r.id === orderDetails.restaurant_id)
    : null;

  const restaurantName = params.restaurantName || restaurant?.name || 'Restaurante';
  const restaurantImage = params.restaurantImage || restaurant?.image || 
    'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  // Calcular los totales si están disponibles en los parámetros
  const subtotal = Number(params.subtotal) || (orderDetails?.total_amount || 0) - (orderDetails?.delivery_fee || 0) - (orderDetails?.service_fee || 0);
  const deliveryFee = Number(params.deliveryFee) || orderDetails?.delivery_fee || 2.99;
  const serviceFee = Number(params.serviceFee) || orderDetails?.service_fee || 1.50;
  const total = Number(params.total) || orderDetails?.total_amount || subtotal + deliveryFee + serviceFee;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Check size={40} color="white" />
          </View>
          
          <Text style={styles.title}>{t('Confirmación exitosa')}</Text>
          <Text style={styles.subtitle}>{t('subtitulo')}</Text>
          
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>{t('numero de orden')}</Text>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.restaurantInfo}>
              <Image 
                source={typeof restaurantImage === 'string' ? { uri: restaurantImage } : restaurantImage} 
                style={styles.restaurantImage} 
              />
              <View style={styles.restaurantDetails}>
                <Text style={styles.restaurantName}>{restaurantName}</Text>
                <View style={styles.restaurantLocation}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.locationText}>2.1km {t('ubicación')}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryDetail}>
                <Clock size={16} color="#E85D04" />
                <View style={styles.deliveryTextContainer}>
                  <Text style={styles.deliveryLabel}>{t('tiempo estimado envio')}</Text>
                  <Text style={styles.deliveryValue}>{estimatedTime} {t('minutos')}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.trackButton}
                onPress={() => router.push(`/order/${orderId}`)}
              >
                <Text style={styles.trackButtonText}>{t('rastrear pedido')}</Text>
                <ChevronRight size={16} color="#E85D04" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.orderSummary}>
            <Text style={styles.summaryTitle}>{t('resumen del pedido')}</Text>

            {/* Si tenemos elementos del pedido, mostrarlos */}
            {orderDetails?.items && orderDetails.items.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <View key={index} style={styles.summaryItem}>
                  <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))
            ) : (
              // Si no hay elementos, mostrar datos de ejemplo
              <>
                <View style={styles.summaryItem}>
                  <Text style={styles.itemName}>Plato principal x2</Text>
                  <Text style={styles.itemPrice}>${(subtotal * 0.6).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.itemName}>Guarnición x1</Text>
                  <Text style={styles.itemPrice}>${(subtotal * 0.3).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.itemName}>Bebida x1</Text>
                  <Text style={styles.itemPrice}>${(subtotal * 0.1).toFixed(2)}</Text>
                </View>
              </>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('deliveryFee')}</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('serviceFee')}</Text>
              <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
            </View>
            
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>{t('total')}</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)')} // Redirigir a la pestaña de inicio en lugar de la raíz
        >
          <Text style={styles.homeButtonText}>{t('volver a inicio')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
    paddingBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#33A95B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E85D04',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTextContainer: {
    marginLeft: 8,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#666',
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: '500',
    marginRight: 4,
  },
  orderSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalItem: {
    marginTop: 8,
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
  homeButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});