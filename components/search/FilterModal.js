import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X, Check, Star } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

function PriceRangeSelector({ value, onChange }) {
  const priceOptions = ['$', '$$', '$$$', '$$$$'];
  
  return (
    <View style={styles.priceRangeContainer}>
      {priceOptions.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.priceOption,
            value === index + 1 && styles.selectedPriceOption
          ]}
          onPress={() => onChange(index + 1)}
        >
          <Text 
            style={[
              styles.priceOptionText,
              value === index + 1 && styles.selectedPriceOptionText
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function RatingSelector({ value, onChange }) {
  const ratings = [5, 4, 3, 2, 1];
  
  return (
    <View style={styles.ratingContainer}>
      {ratings.map((rating) => (
        <TouchableOpacity
          key={rating}
          style={[
            styles.ratingOption,
            value === rating && styles.selectedRatingOption
          ]}
          onPress={() => onChange(rating)}
        >
          <Text 
            style={[
              styles.ratingOptionText,
              value === rating && styles.selectedRatingOptionText
            ]}
          >
            {rating}
          </Text>
          <Star 
            size={16} 
            color={value === rating ? '#E85D04' : '#666'} 
            fill={value === rating ? '#E85D04' : 'none'} 
          />
          <Text 
            style={[
              styles.ratingOptionText,
              value === rating && styles.selectedRatingOptionText
            ]}
          >
            & up
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DistanceSlider({ value, onChange }) {
  return (
    <View style={styles.distanceContainer}>
      <Text style={styles.distanceValue}>{value}km</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack} />
        <View 
          style={[
            styles.sliderFill,
            { width: `${(value / 5) * 100}%` }
          ]} 
        />
        <TouchableOpacity 
          style={[
            styles.sliderThumb,
            { left: `${(value / 5) * 100}%` }
          ]}
          onPress={() => {}}
          // In a real app, we would implement proper slider functionality
          // with gestures
        />
        
        <View style={styles.sliderMarkers}>
          <Text style={styles.sliderMarkerText}>1km</Text>
          <Text style={styles.sliderMarkerText}>3km</Text>
          <Text style={styles.sliderMarkerText}>5km</Text>
        </View>
      </View>
    </View>
  );
}

function CuisineSelector({ selectedCuisines, onToggleCuisine }) {
  const cuisines = [
    'American', 'Italian', 'Mexican', 'Japanese', 'Thai',
    'Chinese', 'Indian', 'Mediterranean', 'Vegetarian', 'Vegan'
  ];
  
  return (
    <View style={styles.cuisineContainer}>
      {cuisines.map((cuisine) => (
        <TouchableOpacity
          key={cuisine}
          style={[
            styles.cuisineOption,
            selectedCuisines.includes(cuisine) && styles.selectedCuisineOption
          ]}
          onPress={() => onToggleCuisine(cuisine)}
        >
          <Text 
            style={[
              styles.cuisineOptionText,
              selectedCuisines.includes(cuisine) && styles.selectedCuisineOptionText
            ]}
          >
            {cuisine}
          </Text>
          {selectedCuisines.includes(cuisine) && (
            <Check size={16} color="#E85D04" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function FilterModal({ visible, onClose, filters, onApplyFilters }) {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };
  
  const handleResetFilters = () => {
    setLocalFilters({
      cuisine: [],
      priceRange: null,
      rating: null,
      distance: 3,
      promoOnly: false,
    });
  };
  
  const toggleCuisine = (cuisine) => {
    setLocalFilters(prev => {
      if (prev.cuisine.includes(cuisine)) {
        return {
          ...prev,
          cuisine: prev.cuisine.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          cuisine: [...prev.cuisine, cuisine]
        };
      }
    });
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Rango de Precio</Text>
              <PriceRangeSelector 
                value={localFilters.priceRange}
                onChange={(value) => setLocalFilters(prev => ({ ...prev, priceRange: value }))}
              />
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Calificación</Text>
              <RatingSelector 
                value={localFilters.rating}
                onChange={(value) => setLocalFilters(prev => ({ ...prev, rating: value }))}
              />
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Distancia</Text>
              <DistanceSlider 
                value={localFilters.distance}
                onChange={(value) => setLocalFilters(prev => ({ ...prev, distance: value }))}
              />
            </View>
            
            <View style={styles.filterSection}>
              <View style={styles.switchContainer}>
                <Text style={styles.filterTitle}>Promotions Only</Text>
                <Switch
                  value={localFilters.promoOnly}
                  onValueChange={(value) => setLocalFilters(prev => ({ ...prev, promoOnly: value }))}
                  trackColor={{ false: '#D9D9D9', true: '#FFD166' }}
                  thumbColor={localFilters.promoOnly ? '#E85D04' : '#F4F4F4'}
                />
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Tipo de Cocina</Text>
              <CuisineSelector 
                selectedCuisines={localFilters.cuisine}
                onToggleCuisine={toggleCuisine}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>Restablecer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  selectedPriceOption: {
    borderColor: '#E85D04',
    backgroundColor: '#FFF0E6',
  },
  priceOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedPriceOptionText: {
    color: '#E85D04',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  selectedRatingOption: {
    borderColor: '#E85D04',
    backgroundColor: '#FFF0E6',
  },
  ratingOptionText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4,
  },
  selectedRatingOptionText: {
    color: '#E85D04',
  },
  distanceContainer: {
    marginBottom: 16,
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E85D04',
    marginBottom: 8,
    textAlign: 'center',
  },
  sliderContainer: {
    height: 40,
    position: 'relative',
    marginBottom: 16,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#E85D04',
    position: 'absolute',
    left: 0,
    top: 8,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E85D04',
    position: 'absolute',
    top: 0,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: 'white',
  },
  sliderMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20,
  },
  sliderMarkerText: {
    fontSize: 12,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    marginBottom: 8,
  },
  selectedCuisineOption: {
    borderColor: '#E85D04',
    backgroundColor: '#FFF0E6',
  },
  cuisineOptionText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  selectedCuisineOptionText: {
    color: '#E85D04',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 8,
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});