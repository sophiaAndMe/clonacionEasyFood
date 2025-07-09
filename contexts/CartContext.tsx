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
  refreshUser: () => Promise<void>; // <-- Nueva función para refrescar usuario después del login
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener el userId real al inicio o crear usuario invitado
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (email) {
          // Usuario autenticado
          const user: any = await Database.getUserByEmail(email);
          if (user && user.id) {
            // Verificar si hay carrito de usuario invitado para migrar
            const guestUserId = await AsyncStorage.getItem('guestUserId');
            if (guestUserId && guestUserId !== user.id) {
              console.log('CartProvider - Migrando carrito de usuario invitado');
              await Database.migrateGuestCartToUser(guestUserId, user.id);
              await AsyncStorage.removeItem('guestUserId');
            }
            
            setUserId(user.id);
            return;
          }
        }
        
        // No hay usuario autenticado, crear/usar usuario invitado
        let guestUserId = await AsyncStorage.getItem('guestUserId');
        if (!guestUserId) {
          // Crear nuevo usuario invitado
          guestUserId = await Database.createGuestUser();
          if (guestUserId) {
            await AsyncStorage.setItem('guestUserId', guestUserId);
            console.log('CartProvider - Usuario invitado creado:', guestUserId);
          }
        }
        
        setUserId(guestUserId);
        console.log('CartProvider - Usando usuario invitado:', guestUserId);
      } catch (error) {
        console.error('CartProvider - Error obteniendo userId:', error);
        // En caso de error, crear un userId temporal
        const tempUserId = 'temp-' + Date.now();
        setUserId(tempUserId);
        console.log('CartProvider - Usando userId temporal:', tempUserId);
      }
    };
    fetchUserId();
  }, []);

  // Permitir recarga manual del carrito desde fuera
  const loadCartItems = async () => {
    if (!userId) {
      console.log('loadCartItems - No hay userId disponible');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('loadCartItems - Cargando items para usuario:', userId);
      
      const cartItems = await Database.getCartItems(userId);
      console.log('loadCartItems - Items obtenidos:', cartItems);
      
      setItems(cartItems as CartItem[]);
      setIsLoading(false);
      
      console.log('loadCartItems - Estado actualizado exitosamente');
    } catch (error) {
      console.error('loadCartItems - Error:', error);
      setIsLoading(false);
      setItems([]); // Limpiar items en caso de error
      
      // No mostrar alerta al usuario por errores de carga, solo log
      console.log('loadCartItems - Error cargando carrito, estableciendo estado vacío');
    }
  };

  useEffect(() => {
    if (userId) {
      Database.initDatabase();
      loadCartItems();
    }
  }, [userId]);

  const addItem = async (product: any, quantity: number, notes: string = '') => {
    if (!userId) {
      console.log('addItem - No hay userId disponible');
      Alert.alert('Error', 'Error del sistema. Por favor intenta nuevamente.');
      return;
    }
    
    try {
      console.log('addItem - Iniciando con producto:', product);
      
      const restaurantId = product.restaurant_id ?? product.restaurantId;
      if (!restaurantId) {
        Alert.alert('Error', 'No se pudo identificar el restaurante del producto');
        return;
      }
      
      console.log('addItem - Restaurant ID:', restaurantId);
      
      // Si el carrito actual tiene productos y el restaurante es diferente, limpiar el carrito antes de agregar
      if (items.length > 0 && items[0].restaurant_id !== restaurantId && items[0].restaurantId !== restaurantId) {
        console.log('addItem - Limpiando carrito debido a cambio de restaurante');
        await clearCart();
      }
      
      // Conversión explícita de IDs a string para evitar datatype mismatch
      const userIdStr = userId.toString();
      const restaurantIdStr = restaurantId.toString();
      const productIdStr = product.id.toString();
      
      console.log('addItem - Llamando Database.addToCart con:', {
        userIdStr, restaurantIdStr, productIdStr, quantity, price: product.price, notes
      });
      
      await Database.addToCart(
        userIdStr,
        restaurantIdStr,
        productIdStr,
        quantity,
        product.price,
        notes
      );
      
      console.log('addItem - Database.addToCart completado, recargando carrito');
      
      // Recarga los items del carrito después de agregar para actualizar el estado
      await loadCartItems();
      
      console.log('addItem - Proceso completado exitosamente');
    } catch (error) {
      console.error('addItem - Error:', error);
      Alert.alert('Error', `No se pudo agregar el producto al carrito: ${error}`);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!userId) {
      console.log('removeItem - No hay userId disponible');
      return;
    }
    
    try {
      console.log('removeItem - Eliminando item:', itemId);
      
      await Database.removeFromCart(itemId);
      
      console.log('removeItem - Item eliminado, recargando carrito');
      
      // Recarga los items del carrito después de eliminar
      await loadCartItems();
      
      console.log('removeItem - Proceso completado exitosamente');
    } catch (error) {
      console.error('removeItem - Error:', error);
      
      // Actualizamos el estado local para mantener sincronización
      console.log('removeItem - Actualizando estado local como fallback');
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // Mostrar error al usuario solo si es crítico
      Alert.alert('Advertencia', 'El producto se eliminó localmente, pero puede volver a aparecer al recargar la app');
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

  // Función para refrescar usuario después del login
  const refreshUser = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        // Usuario autenticado
        const user: any = await Database.getUserByEmail(email);
        if (user && user.id) {
          // Verificar si hay carrito de usuario invitado para migrar
          const guestUserId = await AsyncStorage.getItem('guestUserId');
          if (guestUserId && guestUserId !== user.id) {
            console.log('refreshUser - Migrando carrito de usuario invitado');
            await Database.migrateGuestCartToUser(guestUserId, user.id);
            await AsyncStorage.removeItem('guestUserId');
          }
          
          setUserId(user.id);
          console.log('refreshUser - Usuario actualizado:', user.id);
          return;
        }
      }
      
      console.log('refreshUser - No hay usuario autenticado, manteniendo estado actual');
    } catch (error) {
      console.error('refreshUser - Error:', error);
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
        refreshUser, // <-- Exponer función para refrescar usuario
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
