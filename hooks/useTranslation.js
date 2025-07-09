import { useState, useEffect, createContext, useContext } from 'react';

// Define translations
const translations = {
  en: {
    welcome: {
      slogan: 'Delicious food from local businesses, delivered to your door',
      supportLocal: 'Support small businesses in your community',
      getStarted: 'Get Started',
      switchTo: 'Switch to'
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot Password?',
      or: 'OR',
      loginWithGoogle: 'Login with Google',
      signupWithGoogle: 'Sign up with Google',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',
      customer: 'Customer',
      vendor: 'Vendor'
    },
    tabs: {
      home: 'Home',
      search: 'Search',
      map: 'Map',
      orders: 'Orders',
      profile: 'Profile'
    },
    home: {
      searchPlaceholder: 'Search for restaurants or dishes',
      categories: 'Categories',
      nearby: 'Nearby Restaurants',
      radius: 'radius',
      seeAll: 'See All'
    },
    search: {
      placeholder: 'Search for restaurants or food',
      resultsFor: 'Results for',
      found: 'restaurants found',
      noResults: 'No restaurants found matching your search',
      recentSearches: 'Recent Searches',
      clear: 'Clear All',
      popularCategories: 'Popular Categories',
      filters: 'Filters',
      priceRange: 'Price Range',
      rating: 'Rating',
      distance: 'Distance',
      cuisine: 'Cuisine',
      apply: 'Apply Filters',
      reset: 'Reset',
      sortBy: 'Sort By',
      relevance: 'Relevance',
      popularity: 'Popularity',
      rating: 'Rating',
      distance: 'Distance',
      priceLowest: 'Price: Lowest First',
      priceHighest: 'Price: Highest First'
    },
    map: {
      title: 'Restaurant Map',
      subtitle: 'Discover restaurants near you',
      away: 'away',
      viewMenu: 'View Menu'
    },
    restaurant: {
      about: 'About',
      menu: 'Menu',
      reviews: 'Reviews',
      away: 'away',
      deliveryTime: 'delivery time',
      noDescription: 'No description available for this restaurant.',
      itemsInCart: 'items in cart',
      viewCart: 'View Cart'
    },
    cart: {
      title: 'My Cart',
      items: 'Items',
      deliveryOptions: 'Delivery Options',
      delivery: 'Delivery',
      deliveryTime: 'Delivered in {time} min',
      pickup: 'Pickup',
      pickupTime: 'Ready in {time} min',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      cash: 'Cash on Delivery',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      serviceFee: 'Service Fee',
      total: 'Total',
      placeOrder: 'Place Order',
      emptyCart: 'Your cart is empty',
      emptyCartMessage: 'Add items from restaurants to get started',
      browseRestaurants: 'Browse Restaurants',
      away: 'away',
      free: 'FREE'
    },
    orderConfirmation: {
      success: 'Order Placed Successfully!',
      subtitle: 'Your order has been received and is being processed',
      orderNumber: 'Order Number',
      estimatedDelivery: 'Estimated Delivery',
      minutes: 'minutes',
      track: 'Track Order',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      serviceFee: 'Service Fee',
      total: 'Total',
      backToHome: 'Back to Home',
      away: 'away'
    },
    orderTracking: {
      title: 'Track Order',
      loading: 'Loading order details...',
      notFound: 'Order not found',
      backToOrders: 'Back to My Orders',
      items: 'items',
      orderTime: 'Order Time',
      estimatedDelivery: 'Estimated Delivery',
      status: 'Order Status',
      preparing: 'Preparing',
      preparingDesc: 'The restaurant is preparing your order',
      ready: 'Ready for Pickup',
      readyDesc: 'Your order is ready for pickup or delivery',
      delivering: 'On the Way',
      deliveringDesc: 'Your order is on the way to you',
      completed: 'Delivered',
      completedDesc: 'Your order has been delivered',
      courier: 'Delivery Person',
      onTheWay: 'On the way to you',
      orderDetails: 'Order Details',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      serviceFee: 'Service Fee',
      total: 'Total',
      cancelOrder: 'Cancel Order',
      rateOrder: 'Rate Your Order',
      away: 'away'
    },
    orders: {
      title: 'My Orders',
      active: 'Active',
      past: 'Past',
      noActiveOrders: 'No active orders',
      noPastOrders: 'No past orders',
      browseRestaurants: 'Browse restaurants to place an order',
      orderHistory: 'Your order history will appear here',
      browse: 'Browse Restaurants',
      orderID: 'Order ID',
      details: 'Details',
      statusPreparing: 'Preparing',
      statusReady: 'Ready',
      statusDelivering: 'On the Way',
      statusCompleted: 'Delivered',
      statusCancelled: 'Cancelled'
    },
    profile: {
      title: 'Profile',
      edit: 'Edit',
      account: 'Account',
      personalInfo: 'Personal Information',
      paymentMethods: 'Payment Methods',
      addPaymentMethod: 'Add or manage payment methods',
      notifications: 'Notifications',
      preferences: 'Preferences',
      language: 'Language',
      privacy: 'Privacy & Security',
      support: 'Support',
      help: 'Help & Support',
      settings: 'Settings',
      areYouVendor: 'Are you a restaurant owner?',
      vendorSubtitle: 'Switch to vendor mode to manage your restaurant',
      switchToVendor: 'Switch to Vendor Mode',
      logout: 'Logout'
    },
    vendor: {
      dashboard: 'Dashboard',
      welcomeBack: 'Welcome back!',
      revenue: 'Revenue',
      orders: 'Orders',
      customers: 'Customers',
      rating: 'Rating',
      thisWeek: 'this week',
      salesOverview: 'Sales Overview',
      seeAll: 'See All',
      today: 'Today',
      pending: 'Pending',
      noOrdersToday: 'No orders today',
      noPendingOrders: 'No pending orders',
      topProducts: 'Top Products',
      manageProducts: 'Manage Products',
      sold: 'sold',
      addNewProduct: 'Add New Product',
      viewStats: 'View Statistics',
      editProfile: 'Edit Profile',
      viewDetails: 'View Details',
      statusPreparing: 'Preparing',
      statusReady: 'Ready'
    }
  },
  es: {
    welcome: {
      slogan: 'Comida deliciosa de negocios locales, entregada a tu puerta',
      supportLocal: 'Apoya a los pequeños negocios de tu comunidad',
      getStarted: 'Comenzar',
      switchTo: 'Cambiar a'
    },
    auth: {
      login: 'Iniciar Sesión',
      signup: 'Registrarse',
      fullName: 'Nombre Completo',
      fullNamePlaceholder: 'Ingresa tu nombre completo',
      email: 'Correo Electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      password: 'Contraseña',
      passwordPlaceholder: 'Ingresa tu contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      or: 'O',
      loginWithGoogle: 'Iniciar sesión con Google',
      signupWithGoogle: 'Registrarse con Google',
      noAccount: '¿No tienes una cuenta?',
      haveAccount: '¿Ya tienes una cuenta?',
      customer: 'Cliente',
      vendor: 'Vendedor'
    },
    tabs: {
      home: 'Inicio',
      search: 'Buscar',
      map: 'Mapa',
      orders: 'Pedidos',
      profile: 'Perfil'
    },
    home: {
      searchPlaceholder: 'Buscar restaurantes o platos',
      categories: 'Categorías',
      nearby: 'Restaurantes Cercanos',
      radius: 'de radio',
      seeAll: 'Ver Todos'
    },
    search: {
      placeholder: 'Buscar restaurantes o comida',
      resultsFor: 'Resultados para',
      found: 'restaurantes encontrados',
      noResults: 'No se encontraron restaurantes que coincidan con tu búsqueda',
      recentSearches: 'Búsquedas Recientes',
      clear: 'Borrar Todo',
      popularCategories: 'Categorías Populares',
      filters: 'Filtros',
      priceRange: 'Rango de Precio',
      rating: 'Calificación',
      distance: 'Distancia',
      cuisine: 'Cocina',
      apply: 'Aplicar Filtros',
      reset: 'Restablecer',
      sortBy: 'Ordenar Por',
      relevance: 'Relevancia',
      popularity: 'Popularidad',
      rating: 'Calificación',
      distance: 'Distancia',
      priceLowest: 'Precio: Menor Primero',
      priceHighest: 'Precio: Mayor Primero'
    },
    map: {
      title: 'Mapa de Restaurantes',
      subtitle: 'Descubre restaurantes cerca de ti',
      away: 'de distancia',
      viewMenu: 'Ver Menú'
    },
    restaurant: {
      about: 'Acerca de',
      menu: 'Menú',
      reviews: 'Reseñas',
      away: 'de distancia',
      deliveryTime: 'tiempo de entrega',
      noDescription: 'No hay descripción disponible para este restaurante.',
      itemsInCart: 'artículos en el carrito',
      viewCart: 'Ver Carrito'
    },
    cart: {
      title: 'Mi Carrito',
      items: 'Artículos',
      deliveryOptions: 'Opciones de Entrega',
      delivery: 'Entrega a Domicilio',
      deliveryTime: 'Entrega en {time} min',
      pickup: 'Recoger en Local',
      pickupTime: 'Listo en {time} min',
      paymentMethod: 'Método de Pago',
      creditCard: 'Tarjeta de Crédito',
      cash: 'Efectivo al Entregar',
      orderSummary: 'Resumen del Pedido',
      subtotal: 'Subtotal',
      deliveryFee: 'Costo de Entrega',
      serviceFee: 'Cargo por Servicio',
      total: 'Total',
      placeOrder: 'Realizar Pedido',
      emptyCart: 'Tu carrito está vacío',
      emptyCartMessage: 'Agrega artículos de restaurantes para comenzar',
      browseRestaurants: 'Explorar Restaurantes',
      away: 'de distancia',
      free: 'GRATIS'
    },
    orderConfirmation: {
      success: '¡Pedido Realizado con Éxito!',
      subtitle: 'Tu pedido ha sido recibido y está siendo procesado',
      orderNumber: 'Número de Pedido',
      estimatedDelivery: 'Entrega Estimada',
      minutes: 'minutos',
      track: 'Seguir Pedido',
      orderSummary: 'Resumen del Pedido',
      subtotal: 'Subtotal',
      deliveryFee: 'Costo de Entrega',
      serviceFee: 'Cargo por Servicio',
      total: 'Total',
      backToHome: 'Volver al Inicio',
      away: 'de distancia'
    },
    orderTracking: {
      title: 'Seguir Pedido',
      loading: 'Cargando detalles del pedido...',
      notFound: 'Pedido no encontrado',
      backToOrders: 'Volver a Mis Pedidos',
      items: 'artículos',
      orderTime: 'Hora del Pedido',
      estimatedDelivery: 'Entrega Estimada',
      status: 'Estado del Pedido',
      preparing: 'Preparando',
      preparingDesc: 'El restaurante está preparando tu pedido',
      ready: 'Listo para Recoger',
      readyDesc: 'Tu pedido está listo para recoger o entregar',
      delivering: 'En Camino',
      deliveringDesc: 'Tu pedido está en camino hacia ti',
      completed: 'Entregado',
      completedDesc: 'Tu pedido ha sido entregado',
      courier: 'Repartidor',
      onTheWay: 'En camino hacia ti',
      orderDetails: 'Detalles del Pedido',
      subtotal: 'Subtotal',
      deliveryFee: 'Costo de Entrega',
      serviceFee: 'Cargo por Servicio',
      total: 'Total',
      cancelOrder: 'Cancelar Pedido',
      rateOrder: 'Calificar tu Pedido',
      away: 'de distancia'
    },
    orders: {
      title: 'Mis Pedidos',
      active: 'Activos',
      past: 'Anteriores',
      noActiveOrders: 'No tienes pedidos activos',
      noPastOrders: 'No tienes pedidos anteriores',
      browseRestaurants: 'Explora restaurantes para realizar un pedido',
      orderHistory: 'Tu historial de pedidos aparecerá aquí',
      browse: 'Explorar Restaurantes',
      orderID: 'ID de Pedido',
      details: 'Detalles',
      statusPreparing: 'Preparando',
      statusReady: 'Listo',
      statusDelivering: 'En Camino',
      statusCompleted: 'Entregado',
      statusCancelled: 'Cancelado'
    },
    profile: {
      title: 'Perfil',
      edit: 'Editar',
      account: 'Cuenta',
      personalInfo: 'Información Personal',
      paymentMethods: 'Métodos de Pago',
      addPaymentMethod: 'Agregar o administrar métodos de pago',
      notifications: 'Notificaciones',
      preferences: 'Preferencias',
      language: 'Idioma',
      privacy: 'Privacidad y Seguridad',
      support: 'Soporte',
      help: 'Ayuda y Soporte',
      settings: 'Configuración',
      areYouVendor: '¿Eres dueño de un restaurante?',
      vendorSubtitle: 'Cambia al modo vendedor para administrar tu restaurante',
      switchToVendor: 'Cambiar a Modo Vendedor',
      logout: 'Cerrar Sesión'
    },
    vendor: {
      dashboard: 'Panel',
      welcomeBack: '¡Bienvenido de nuevo!',
      revenue: 'Ingresos',
      orders: 'Pedidos',
      customers: 'Clientes',
      rating: 'Calificación',
      thisWeek: 'esta semana',
      salesOverview: 'Resumen de Ventas',
      seeAll: 'Ver Todo',
      today: 'Hoy',
      pending: 'Pendientes',
      noOrdersToday: 'No hay pedidos hoy',
      noPendingOrders: 'No hay pedidos pendientes',
      topProducts: 'Productos Principales',
      manageProducts: 'Administrar Productos',
      sold: 'vendidos',
      addNewProduct: 'Agregar Nuevo Producto',
      viewStats: 'Ver Estadísticas',
      editProfile: 'Editar Perfil',
      viewDetails: 'Ver Detalles',
      statusPreparing: 'Preparando',
      statusReady: 'Listo'
    }
  }
};

// Create translation context
const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const toggleLanguage = () => {
    setCurrentLanguage(prevLang => (prevLang === 'en' ? 'es' : 'en'));
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if translation not found
      }
    }
    
    return value;
  };

  return (
    <TranslationContext.Provider value={{ t, toggleLanguage, currentLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translation context
export function useTranslation() {
  const context = useContext(TranslationContext) || {
    t: (key) => key,
    toggleLanguage: () => {},
    currentLanguage: 'en'
  };
  
  return context;
}