import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockOrders } from '@/data/mockData';

function RatingStars({ rating, setRating, size = 32 }) {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Star
            size={size}
            color="#FFD700"
            fill={rating >= star ? "#FFD700" : "transparent"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [overallRating, setOverallRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // Find the order by ID
  const order = mockOrders.find(o => o.id.toString() === id);
  
  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('review.title')}</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </View>
    );
  }
  
  const handleSubmit = () => {
    // In a real app, this would save the review to a database
    console.log({
      orderId: id,
      overallRating,
      foodRating,
      deliveryRating,
      comment
    });
    
    // Navigate back to orders screen
    router.push('/orders');
  };
  
  const isFormValid = overallRating > 0 && foodRating > 0 && 
    (order.status === 'completed' ? deliveryRating > 0 : true);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('review.title')}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.restaurantInfo}>
          <Image 
            source={typeof order.restaurantImage === 'string' ? { uri: order.restaurantImage } : order.restaurantImage} 
            style={styles.restaurantImage} 
          />
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
        </View>
        
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>{t('review.overallExperience')}</Text>
          <RatingStars rating={overallRating} setRating={setOverallRating} />
          <Text style={styles.ratingDescription}>
            {overallRating > 0 
              ? t(`review.rating${overallRating}`) 
              : t('review.tapToRate')}
          </Text>
        </View>
        
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>{t('review.foodQuality')}</Text>
          <RatingStars rating={foodRating} setRating={setFoodRating} size={28} />
        </View>
        
        {order.status === 'completed' && (
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>{t('review.deliveryService')}</Text>
            <RatingStars rating={deliveryRating} setRating={setDeliveryRating} size={28} />
          </View>
        )}
        
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>{t('review.additionalComments')}</Text>
          <TextInput
            style={styles.commentInput}
            placeholder={t('review.commentPlaceholder')}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.itemsSection}>
          <Text style={styles.itemsTitle}>{t('review.orderedItems')}</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>{t('review.submitReview')}</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  restaurantInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  commentSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    height: 120,
  },
  itemsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E85D04',
    marginRight: 8,
    width: 30,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: '#E85D04',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});