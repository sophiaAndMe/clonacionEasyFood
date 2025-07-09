import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import RestaurantCard from '@/components/home/RestaurantCard';
import FilterModal from '@/components/search/FilterModal';
import { mockRestaurants } from '@/data/mockData';

interface Filters {
  cuisine: string[];
  priceRange: string | null;
  rating: number | null;
  distance: number;
  promoOnly: boolean;
}

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    cuisine: [],
    priceRange: null,
    rating: null,
    distance: 3,
    promoOnly: false,
  });

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar restaurantes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <SlidersHorizontal size={20} color="#E85D04" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {searchQuery.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Resultados para "{searchQuery}"
              </Text>
              <Text style={styles.resultsCount}>
                {filteredRestaurants.length} restaurantes encontrados
              </Text>
            </View>

            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              />
            ))}

            {filteredRestaurants.length === 0 && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No se encontraron resultados</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.recentSearches}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
              <TouchableOpacity>
                <Text style={styles.clearText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.recentItem}>
              <Search size={18} color="#999" />
              <Text style={styles.recentText}>Pizza</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recentItem}>
              <Search size={18} color="#999" />
              <Text style={styles.recentText}>Hamburguesas</Text>
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorías populares</Text>
            </View>

            <View style={styles.categoriesContainer}>
              {['Pizza', 'Hamburguesas', 'Tacos', 'Vegetariano', 'Postres', 'Café'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryTag}
                  onPress={() => setSearchQuery(category)}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={activeFilters}
        onApplyFilters={(filters: Filters) => {
          setActiveFilters(filters);
          setShowFilterModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: '#FFF0E6',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsHeader: {
    marginTop: 16,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noResults: {
    alignItems: 'center',
    marginTop: 48,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  recentSearches: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#E85D04',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  categoryText: {
    color: '#E85D04',
    fontSize: 14,
  },
});