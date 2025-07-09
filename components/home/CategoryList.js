import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { mockCategories } from '@/data/mockData';

function CategoryItem({ category, onPress }) {
  // Permitir require (local) o string (remoto)
  const imageSource = typeof category.image === 'number'
    ? category.image
    : { uri: category.image };
    
  return (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => onPress(category)}
    >
      <Image source={imageSource} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );
}

export default function CategoryList() {
  const { t } = useTranslation();
  
  const handleCategoryPress = (category) => {
    console.log(`Selected category: ${category.name}`);
    // In a real app, this would filter restaurants or navigate to a category screen
  };
  
  return (
    <FlatList
      data={mockCategories}
      renderItem={({ item }) => (
        <CategoryItem 
          category={item} 
          onPress={handleCategoryPress}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 80,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});