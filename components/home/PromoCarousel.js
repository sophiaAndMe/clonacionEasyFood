import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockPromotions } from '@/data/mockData';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 48; // Full width minus padding
const ITEM_HEIGHT = 160;

export default function PromoCarousel() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Auto scroll
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (activeIndex < mockPromotions.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: activeIndex + 1,
          animated: true
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true
        });
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [activeIndex]);
  
  const renderItem = ({ item }) => {
    // Permitir require (local) o string (remoto)
    const imageSource = typeof item.image === 'number'
      ? item.image
      : { uri: item.image };
    return (
      <TouchableOpacity 
        style={[
          styles.promoItem, 
          { backgroundColor: item.backgroundColor }
        ]}
      >
        <View style={styles.promoContent}>
          <Text style={[styles.promoTitle, { color: item.textColor }]}>
            {item.title}
          </Text>
          <Text style={[styles.promoDescription, { color: item.textColor }]}>
            {item.description}
          </Text>
          <TouchableOpacity 
            style={[styles.promoButton, { borderColor: item.textColor }]}
          >
            <Text style={[styles.promoButtonText, { color: item.textColor }]}>
              Ver Todo
            </Text>
          </TouchableOpacity>
        </View>
        <Image source={imageSource} style={styles.promoImage} />
      </TouchableOpacity>
    );
  };
  
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={mockPromotions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH + 16} // Width + margin
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.flatListContainer}
      />
      
      <View style={styles.pagination}>
        {mockPromotions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
  promoItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    marginRight: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 16,
  },
  promoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  promoButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  promoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#E85D04',
    width: 16,
  },
});