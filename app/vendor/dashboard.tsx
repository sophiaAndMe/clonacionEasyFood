import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ChevronRight, DollarSign, Package, ShoppingBag, Star, TrendingUp, Users } from 'lucide-react-native';

interface StatData {
  icon: any;
  title: string;
  value: string;
  trend: string;
  trendValue: number;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  orderCount: number;
  rating: number;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Datos del restaurante
  const restaurantData = {
    name: "Mote Colonial",
    rating: 4.8,
    totalReviews: 312,
    totalOrders: 1842,
    address: "Centro Histórico, Quito",
    since: "2018"
  };

  // Datos de ventas diarias simuladas para la última semana (en dólares)
  const weeklyData = [
    { day: 'Lun', sales: 425, orders: 85 },
    { day: 'Mar', sales: 380, orders: 76 },
    { day: 'Mié', sales: 395, orders: 79 },
    { day: 'Jue', sales: 450, orders: 90 },
    { day: 'Vie', sales: 580, orders: 116 },
    { day: 'Sáb', sales: 725, orders: 145 },
    { day: 'Dom', sales: 650, orders: 130 },
  ];

  // Platos más populares
  const popularItems: MenuItem[] = [
    { id: '1', name: 'Mote con Chicharrón', price: '$3.50', orderCount: 248, rating: 4.9 },
    { id: '2', name: 'Combo Familiar Mote Mixto', price: '$12.50', orderCount: 156, rating: 4.8 },
    { id: '3', name: 'Mote Pillo Especial', price: '$4.25', orderCount: 195, rating: 4.7 },
    { id: '4', name: 'Mote Sucio con Fritada', price: '$5.00', orderCount: 178, rating: 4.8 },
    { id: '5', name: 'Motecito del Chef', price: '$6.50', orderCount: 134, rating: 4.9 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Estadísticas principales
  const stats: StatData[] = [
    {
      icon: DollarSign,
      title: 'Ventas de Hoy',
      value: '$485.50',
      trend: '+12.8%',
      trendValue: 12.8
    },
    {
      icon: ShoppingBag,
      title: 'Pedidos del Día',
      value: '97',
      trend: '+15.4%',
      trendValue: 15.4
    },
    {
      icon: Users,
      title: 'Clientes Nuevos',
      value: '28',
      trend: '+22.7%',
      trendValue: 22.7
    },
    {
      icon: Star,
      title: 'Satisfacción',
      value: '4.8',
      trend: '+0.1',
      trendValue: 0.1
    }
  ];

  const renderStats = () => {
    return stats.map((stat, index) => (
      <View key={index} style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={styles.statIconContainer}>
            <stat.icon size={20} color="#E85D04" />
          </View>
          <Text style={styles.statTitle}>{stat.title}</Text>
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <View style={[
            styles.trendContainer,
            { backgroundColor: stat.trendValue >= 0 ? '#E8F5E9' : '#FFEBEE' }
          ]}>
            <ArrowUpRight 
              size={16} 
              color={stat.trendValue >= 0 ? '#4CAF50' : '#F44336'}
              style={stat.trendValue < 0 ? { transform: [{ rotate: '90deg' }] } : undefined}
            />
            <Text style={[
              styles.trendValue,
              { color: stat.trendValue >= 0 ? '#4CAF50' : '#F44336' }
            ]}>{stat.trend}</Text>
          </View>
        </View>
      </View>
    ));
  };

  const renderSalesChart = () => {
    const maxSale = Math.max(...weeklyData.map(d => d.sales));
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {weeklyData.map((data, index) => (
            <View key={index} style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar,
                  { height: (data.sales / maxSale) * 150 }
                ]} 
              />
              <Text style={styles.barLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartLabels}>
          <Text style={styles.chartLabel}>Ventas diarias última semana</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando panel de {restaurantData.name}...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{restaurantData.name}</Text>
            <Text style={styles.headerSubtitle}>{restaurantData.address}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingText}>
                {restaurantData.rating} · {restaurantData.totalReviews} reseñas · Desde {restaurantData.since}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => {/* Implementar configuración */}}
          >
            <Text style={styles.settingsButtonText}>Ajustes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {renderStats()}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Resumen de Ventas</Text>
          {renderSalesChart()}
          <View style={styles.chartSummary}>
            <Text style={styles.chartSummaryText}>
              Total de la semana: ${weeklyData.reduce((sum, day) => sum + day.sales, 0).toFixed(2)}
            </Text>
            <Text style={styles.chartSummaryText}>
              Promedio diario: ${(weeklyData.reduce((sum, day) => sum + day.sales, 0) / 7).toFixed(2)}
            </Text>
            <Text style={styles.chartSummaryText}>
              Mejor día: {weeklyData.reduce((best, day) => day.sales > best.sales ? day : best).day} (${weeklyData.reduce((best, day) => day.sales > best.sales ? day : best).sales})
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Platos Más Vendidos</Text>
          <View style={styles.menuList}>
            {popularItems.map((item, index) => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemPrice}>{item.price}</Text>
                </View>
                <View style={styles.menuItemStats}>
                  <View style={styles.menuItemRating}>
                    <Star size={14} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.ratingValue}>{item.rating}</Text>
                  </View>
                  <Text style={styles.menuItemOrders}>{item.orderCount} pedidos</Text>
                  <ChevronRight size={20} color="#666" />
                </View>
              </View>
            ))}
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 6,
    color: '#495057',
    fontSize: 14,
  },
  settingsButton: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  statTitle: {
    color: '#495057',
    fontSize: 14,
    flex: 1,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendValue: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    marginTop: 10,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#E85D04',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#6C757D',
  },
  chartLabels: {
    alignItems: 'center',
    marginTop: 16,
  },
  chartLabel: {
    fontSize: 14,
    color: '#495057',
  },
  chartSummary: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  chartSummaryText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  menuList: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#E85D04',
    fontWeight: '500',
  },
  menuItemStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingValue: {
    fontSize: 12,
    color: '#E85D04',
    fontWeight: '500',
    marginLeft: 4,
  },
  menuItemOrders: {
    fontSize: 14,
    color: '#6C757D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    color: '#495057',
    marginTop: 12,
  },
});