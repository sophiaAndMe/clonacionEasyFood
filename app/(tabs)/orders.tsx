import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Clock } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrders, getOrderDetails, getUserByEmail } from '@/utils/database';
import { mockRestaurants } from '@/data/mockData';
import { DeviceEventEmitter } from 'react-native';

type OrderStatus = 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  status: OrderStatus;
  date: string;
  total: number;
  customerName: string;
  items: OrderItem[];
}

interface OrderStatusIndicatorProps {
  status: OrderStatus;
}

interface OrderItemProps {
  order: Order;
  onPress: () => void;
}

function OrderStatusIndicator({ status }: OrderStatusIndicatorProps) {
  const getStatusColor = (): string => {
    switch (status) {
      case 'preparing':
        return '#FF8C42';
      case 'ready':
        return '#33A95B';
      case 'delivering':
        return '#2B80FF';
      case 'completed':
        return '#666666';
      case 'cancelled':
        return '#E53935';
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return 'Listo para entrega';
      case 'delivering':
        return 'En camino';
      case 'completed':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <View style={[styles.statusIndicator, { backgroundColor: `${getStatusColor()}20` }]}>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {getStatusText(status)}
      </Text>
    </View>
  );
}

function OrderItem({ order, onPress }: OrderItemProps) {
  const formattedDate = new Date(order.date).toLocaleDateString();
  const formattedTime = new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Manejo seguro de imagen: si es string, usar uri; si es número (require), usar directamente
  let imageSource: any = null;
  if (typeof order.restaurantImage === 'string') {
    imageSource = { uri: order.restaurantImage };
  } else if (typeof order.restaurantImage === 'number') {
    imageSource = order.restaurantImage;
  } else {
    imageSource = undefined;
  }

  return (
    <TouchableOpacity style={styles.orderItem} onPress={onPress}>
      <View style={styles.orderHeader}>
        <Image source={imageSource} style={styles.restaurantImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.orderDate}>
            <Clock size={12} color="#666" /> {formattedDate} {formattedTime}
          </Text>
        </View>
        <OrderStatusIndicator status={order.status as OrderStatus} />
      </View>
      
      <View style={styles.orderSummary}>
        <Text style={styles.orderItems}>
          {order.items.map((item: OrderItem) => item.name).join(', ')}
        </Text>
        <Text style={styles.orderTotal}>
          ${order.total.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderId}>
          Pedido #{order.id}
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsText}>Ver Detalles</Text>
          <ArrowRight size={16} color="#E85D04" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    try {
      const dbOrders = getOrders(userId); // userId es string
      setOrders(dbOrders);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Escuchar evento de nuevos pedidos
  useEffect(() => {
    const refreshListener = () => {
      if (userId) loadOrders();
    };
    const subscription = DeviceEventEmitter.addListener('refreshOrders', refreshListener);
    return () => {
      subscription.remove();
    };
  }, [userId, loadOrders]);

  useEffect(() => {
    const fetchUserId = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;
      const user: any = getUserByEmail(email);
      if (user && user.id) setUserId(user.id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) loadOrders();
  }, [userId, loadOrders]);

  // Map orders to UI format
  const mappedOrders = orders.map((order: any) => {
    const details = getOrderDetails(order.id);
    // Buscar restaurante real
    const restaurant = mockRestaurants.find(r => r.id == (order.restaurant_id || order.restaurantId));
    return {
      id: order.id,
      restaurantId: order.restaurant_id || order.restaurantId,
      restaurantName: restaurant?.name || order.restaurant_id || 'Restaurante',
      restaurantImage: restaurant?.image || details?.items?.[0]?.image_url || '',
      status: order.status,
      date: order.created_at,
      total: order.total_amount,
      customerName: order.customer_name,
      items: details?.items || [],
    };
  });

  const activeOrders = mappedOrders.filter((order: any) =>
    ['preparing', 'ready', 'delivering'].includes(order.status)
  );
  const pastOrders = mappedOrders.filter((order: any) =>
    ['completed', 'cancelled'].includes(order.status)
  );

  const handleOrderPress = (orderId: number) => {
    router.push(`/order/${orderId}`);
  };

  const handleBrowsePress = () => {
    router.push('/');
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <OrderItem
      order={item}
      onPress={() => handleOrderPress(item.id)}
    />
  );

  const renderEmptyState = () => {
    const isEmpty = activeTab === 'active'
      ? activeOrders.length === 0
      : pastOrders.length === 0;
    if (!isEmpty) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>
          {activeTab === 'active'
            ? 'No tienes pedidos activos'
            : 'No tienes pedidos anteriores'}
        </Text>
        <Text style={styles.emptyStateText}>
          {activeTab === 'active'
            ? 'Explorar Restaurantes'
            : 'Historial de Pedidos'}
        </Text>
        {activeTab === 'active' && (
          <TouchableOpacity
            style={styles.browseButton}
            onPress={handleBrowsePress}
          >
            <Text style={styles.browseButtonText}>Explorar Ahora</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size={'large'} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Pedidos Activos ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Pedidos Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'active' ? activeOrders : pastOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.orderList}
        ListEmptyComponent={renderEmptyState}
      />
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E85D04',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#E85D04',
  },
  orderList: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItems: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  orderId: {
    fontSize: 12,
    color: '#999',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    color: '#E85D04',
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
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