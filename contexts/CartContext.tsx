import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Database from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string; // Cambiado a string
  product_id: string;
  quantity: number;
  price: number;
  notes?: string;
  name: string;
  image_url: string;
  restaurant_id?: string;
  restaurantId?: string;
  cart_id?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity: number, notes?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>; // Cambiado a string
  clearCart: () => Promise<void>;
  total: number;
  isLoading: boolean;
  reloadCart: () => Promise<void>; // <-- Nueva función para recargar el carrito
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener el userId real al inicio
  useEffect(() => {
    const fetchUserId = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) return;
      const user: any = await Database.getUserByEmail(email);
      if (user && user.id) setUserId(user.id);
    };
    fetchUserId();
  }, []);

  // Permitir recarga manual del carrito desde fuera
  const loadCartItems = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const cartItems = await Database.getCartItems(userId);
      setItems(cartItems as CartItem[]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Database.initDatabase();
      loadCartItems();
    }
  }, [userId]);

  const addItem = async (product: any, quantity: number, notes: string = '') => {
    if (!userId) return;
    try {
      const restaurantId = product.restaurant_id ?? product.restaurantId;
      if (!restaurantId) {
        Alert.alert('Error', 'No se pudo identificar el restaurante del producto');
        return;
      }
      // Si el carrito actual tiene productos y el restaurante es diferente, limpiar el carrito antes de agregar
      if (items.length > 0 && items[0].restaurant_id !== restaurantId && items[0].restaurantId !== restaurantId) {
        await clearCart();
      }
      // Conversión explícita de IDs a string para evitar datatype mismatch
      const userIdStr = userId.toString();
      const restaurantIdStr = restaurantId.toString();
      const productIdStr = product.id.toString();
      await Database.addToCart(
        userIdStr,
        restaurantIdStr,
        productIdStr,
        quantity,
        product.price,
        notes
      );
      // Recarga los items del carrito después de agregar para actualizar el estado
      await loadCartItems();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    }
  };

  const removeItem = async (itemId: string) => {
    if (!userId) return;
    try {
      await Database.removeFromCart(itemId);
      // Recarga los items del carrito después de eliminar
      await loadCartItems();
    } catch (error) {
      // Solo registrar el error en consola sin mostrar alerta al usuario
      console.error('Error removing item from cart:', error);
      
      // Actualizamos el estado local para mantener sincronización
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      if (items.length > 0) {
        // Eliminar todos los elementos del carrito uno por uno
        for (const item of items) {
          await Database.removeFromCart(item.id);
        }
        setItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'No se pudo limpiar el carrito');
    }
  };

  // Calculamos solo el subtotal de los items sin gastos de envío
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        total,
        isLoading,
        reloadCart: loadCartItems, // <-- Exponer función para recargar
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
