import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function RestaurantCard({ restaurant, onPress }) {
  const { t } = useTranslation();
  // Permitir require (local) o string (remoto)
  const imageSource = typeof restaurant.image === 'number'
    ? restaurant.image
    : { uri: restaurant.image };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <Image source={imageSource} style={styles.image} />
      
      {restaurant.promo && (
        <View style={styles.promoTag}>
          <Text style={styles.promoText}>{restaurant.promo}</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
          <View style={styles.dot} />
          <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MapPin size={14} color="#666" />
            <Text style={styles.infoText}>{restaurant.distance}km de distancia</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={14} color="#666" />
            <Text style={styles.infoText}>{restaurant.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  promoTag: {
    position: 'absolute',
    top: 12,
    left: 0,
    backgroundColor: '#E85D04',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  promoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 8,
  },
  cuisine: {
    fontSize: 12,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});