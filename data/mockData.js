// Mock data for restaurants
export const mockRestaurants = [
  {
    id: "1",
    name: "¡Hasta la Vuelta!, Señor",
    cuisine: "Tipica",
    rating: 4.7,
    reviewCount: 245,
    distance: 1.2,
    deliveryTime: "25-40 min",
    image: require("../assets/fotoRestaurante/fondoversiongrentehlvs.jpg"),
    promo: "Por la compra de un plato, el segundo a mitad de precio!!",
    description: "Descubrir el sabor típico de Quito, es rescatar del tiempo sus tradiciones, raíces y leyendas",
    address: "Chile Oe 456, Quito 170401",
    menu: [
      {
        id: "1",
        name: "Fanesca",
        description: "Plato tradicional ecuatoriano, un potaje que se prepara principalmente durante la Semana Santa",
        price: 12.99,
        image: require("../assets/fotoComida-1/fanesca.jpg"),
        category: "Tipico"
      },
      {
        id: "2",
        name: "Estofado de Carne",
        description: "Arroz, comida típica ecuatoriana, con carne de res, papas y zanahorias",
        price: 14.99,
        image: require("../assets/fotoComida-1/estofadodecarne.jpg"),
        category: "Tipico"
      },
      {
        id: "3",
        name: "fritada",
        description: "Deliciosa fritada de cerdo con mote y llapingachos",
        price: 13.99,
        image: require("../assets/fotoComida-1/fritada.jpg"),
        category: "Fritada"
      },
      {
        id: "4",
        name: "churasco",
        description: "Huevos, carne de res, plátano maduro y aguacate",
        price: 4.99,
        image: require("../assets/fotoComida-1/churasco.jpg"),
        category: "Tipico"
      },
      {
        id: "5",
        name: "empanadas",
        description: "empanadas de carne, pollo o queso, acompañadas de ají",
        price: 5.99,
        image: require("../assets/fotoComida-1/empanadas.jpg"),
        category: "Empanadas"
      },
      {
        id: "6",
        name: "seco de chivo",
        description: "chivo guisado con especias, acompañado de arroz y plátano",
        price: 5.99,
        image: require("../assets/fotoComida-1/secochivo.jpg"),
        category: "Secos"
      }
    ]
  },
  {
    id: "2",
    name: "Las menestras de la almagro",
    cuisine: "Asados",
    rating: 4.5,
    reviewCount: 189,
    distance: 0.8,
    deliveryTime: "30-45 min",
    image: require("../assets/fotoRestaurante/lasmestras.jpg"),
    description: "Restaurante especializado en platos de carne asada y fritos",
    promo: "3x2 en platos de carne",
    address: "Av. Almagro y Colón, Quito 170143, Ecuador",
    menu: [
      {
        id: "7",
        name: "Churasco",
        description: "Carne asada con arroz, plátano y ensalada",
        price: 14.99,
        image: require("../assets/fotoComida-2/churasco.jpg"),
        category: "Tipico"
      },
      {
        id: "8",
        name: "Filete de Pollo",
        description: "Pollo frito con papas fritas y ensalada",
        price: 16.99,
        image: require("../assets/fotoComida-2/filetepollo.jpg"),
        category: "Fritos"
      }
    ]
  },
  {
    id: "3",
    name: "Cafe San Blas",
    cuisine: "Cafeteria",
    rating: 4.3,
    reviewCount: 156,
    distance: 1.5,
    deliveryTime: "20-35 min",
    image: require("../assets/fotoRestaurante/cafesb.jpg"),
    description: "Cafetería acogedora con una variedad de cafés, postres y pizzas",
    promo: null,
    address: "Plaza de San Blas, Av. Pichincha, Quito 170136, Ecuador",
    menu: [
      {
        id: "9",
        name: "Postre de Chocolate",
        description: "Postre de chocolate con helado de vainilla",
        price: 12.99,
        image: require("../assets/fotoComida-3/cocteldec.jpg"),
        category: "Postres"
      },
      {
        id: "10",
        name: "Pizza con Pimiento y Champiñones",
        description: "Pizza con pimiento y champiñones",
        price: 11.99,
        image: require("../assets/fotoComida-3/pizzapim.jpg"),
        category: "Pizzas"
      }
    ]
  },
  {
    id: "4",
    name: "Corvinas de Don Jimmy",
    cuisine: "Ecuatoriana",
    rating: 4.8,
    reviewCount: 312,
    distance: 2.2,
    deliveryTime: "35-50 min",
    image: require("../assets/fotoRestaurante/corvinasj.jpg"),
    description: "Restaurante especializado en mariscos frescos y platos típicos ecuatorianos",
    promo: "Gratis chifles con tu pedido",
    address: "Mercado Central, Av. Pichincha y Esmeraldas, Quito 170136, Ecuador",
    menu: [
      {
        id: "11",
        name: "Corvina",
        description: "Corvina fresca a la parrilla con guarnición de ensalada",
        price: 8.99,
        image: require("../assets/fotoComida-4/corvin.jpg"),
        category: "Mariscos"
      },
      {
        id: "12",
        name: "encebollado",
        description: "Sopa de pescado con cebolla y yuca",
        price: 9.99,
        image: require("../assets/fotoComida-4/encebollado.jpg"),
        category: "Sopas"
      }
    ]
  },
  {
    id: "5",
    name: "Mote Colonial",
    cuisine: "Tradicional",
    rating: 4.6,
    reviewCount: 178,
    distance: 1.1,
    deliveryTime: "25-40 min",
    image: require("../assets/fotoRestaurante/motecol.jpg"),
    description: "Restaurante tradicional ecuatoriano especializado en mote y platos típicos",
    promo: "Dos refrescos gratis con tu pedido",
    address: "Calle La Ronda, Venezuela y Morales, Quito 170150, Ecuador",
    menu: [
      {
        id: "13",
        name: "Bolon de Plátano",
        description: "Bolon de plátano verde con ensalada de vegetales y salsa de ají",
        price: 13.99,
        image: require("../assets/fotoComida-5/bolon.jpg"),
        category: "Bolones"
      },
      {
        id: "14",
        name: "Mote con chicharrón",
        description: "Mote con chicharrón y ensalada de cebolla",
        price: 11.99,
        image: require("../assets/fotoComida-5/motechichaa.jpg"),
        category: "Mote"
      }
    ]
  }
];

// Mock data for categories
export const mockCategories = [
  {
    id: 1,
    name: "Motes",
    image: require("../assets/fotoComida-5/motechichaa.jpg")
  },
  {
    id: 2,
    name: "Fritadas",
    image: require("../assets/fotoComida-1/fritada.jpg")
  },
  {
    id: 3,
    name: "Fritos",
    image: require("../assets/fotoComida-2/filetepollo.jpg")
  },
  {
    id: 4,
    name: "Sopas",
    image: require("../assets/fotoComida-4/encebollado.jpg")
  },
  {
    id: 5,
    name: "Pizzas",
    image: require("../assets/fotoComida-3/pizzapim.jpg")
  },
  {
    id: 6,
    name: "Postres",
    image: require("../assets/fotoComida-3/cocteldec.jpg")
  }
];

// Mock data for promotions
export const mockPromotions = [
  {
    id: 1,
    title: "50% en tu primer pedido",
    description: "Use code WELCOME50",
    backgroundColor: "#FFF0E6",
    textColor: "#E85D04",
    image: require("../assets/fotoComida-5/bolon.jpg")
  },
  {
    id: 2,
    title: "Pedidos a Domicilio gratis en Agosto",
    description: "Compras superiores a $20",
    backgroundColor: "#E6F7EF",
    textColor: "#33A95B",
    image: require("../assets/fotoComida-1/fanesca.jpg")
  },
  {
    id: 3,
    title: "Ayuda a locales tradicionales",
    description: "Deja una propina a los restaurantes locales",
    backgroundColor: "#E6F1FF",
    textColor: "#2B80FF",
    image: require("../assets/fotoComida-1/churasco.jpg")
  }
];

// Mock data for orders
export const mockOrders = [
  {
    id: 1001,
    restaurantId: 1,
    restaurantName: "Cafe San Blas",
    image: require("../assets/fotoComida-3/cocteldec.jpg"),
    status: "delivering",
    date: new Date().toISOString(),
    total: 41.45,
    customerName: "John Doe",
    items: [
      {
        id: 1,
        name: "Postre de coctel de chocolate",
        price: 12.99,
        quantity: 2,
        notes: "Sin crema de chocolate"
      },
      {
        id: 4,
        name: "Americano",
        price: 4.99,
        quantity: 1
      },
      {
        id: 6,
        name: "Cruasan de Mantequilla",
        price: 5.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1002,
    restaurantId: 2,
    restaurantName: "Corvinas de Don Jimmy",
    image: require("../assets/fotoComida-4/corvin.jpg"),
    status: "completed",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    total: 33.97,
    customerName: "John Doe",
    items: [
      {
        id: 7,
        name: "Corvina a la Parrilla",
        price: 14.99,
        quantity: 1
      },
      {
        id: 8,
        name: "Porcion de papas",
        price: 1.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1003,
    restaurantId: 3,
    restaurantName: "Hasta la Vuelta!, Señor",
    image: require("../assets/fotoComida-1/secochivo.jpg"),
    status: "preparing",
    date: new Date().toISOString(),
    total: 25.97,
    customerName: "John Doe",
    items: [
      {
        id: 9,
        name: "Seco de Chivo",
        price: 12.99,
        quantity: 1
      },
      {
        id: 10,
        name: "Limonada",
        price: 1.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1004,
    restaurantId: 4,
    restaurantName: "Las menestras de la almagro",
    image: require("../assets/fotoRestaurante/lasmestras.jpg"),
    status: "cancelled",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    total: 28.97,
    customerName: "John Doe",
    items: [
      {
        id: 11,
        name: "Asado de carne",
        price: 8.99,
        quantity: 2
      },
      {
        id: 12,
        name: "Costillas BBQ",
        price: 9.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1005,
    restaurantId: 5,
    restaurantName: "Mote Colonial",
    image: require("../assets/fotoRestaurante/motecol.jpg"),
    status: "ready",
    date: new Date().toISOString(),
    total: 27.97,
    customerName: "John Doe",
    items: [
      {
        id: 13,
        name: "Mote con Chicharrón",
        price: 13.99,
        quantity: 1
      },
      {
        id: 14,
        name: "Bolón de Plátano",
        price: 11.99,
        quantity: 1
      }
    ]
  }
];

// Mock data for products (for vendor dashboard)
export const mockProducts = [
  {
    id: 1,
    name: "Classic Burger",
    price: 12.99,
    image: require("../assets/fotoComida-1/fanesca.jpg"),
    category: "burgers",
    available: true,
    sales: 127
  },
  {
    id: 2,
    name: "Bacon Deluxe",
    price: 14.99,
    image: require("../assets/fotoComida-1/fanesca.jpg"),
    category: "burgers",
    available: true,
    sales: 98
  },
  {
    id: 3,
    name: "Veggie Burger",
    price: 13.99,
    image: require("../assets/fotoComida-1/fanesca.jpg"),
    category: "burgers",
    available: true,
    sales: 76
  },
  {
    id: 4,
    name: "French Fries",
    price: 4.99,
    image: require("../assets/fotoComida-1/fanesca.jpg"),
    category: "sides",
    available: true,
    sales: 243
  },
  {
    id: 5,
    name: "Onion Rings",
    price: 5.99,
    image: require("../assets/fotoComida-1/fanesca.jpg"),
    category: "sides",
    available: true,
    sales: 156
  },
  {
    id: 6,
    name: "Chocolate Milkshake",
    price: 5.99,
    image: require("../assets/fotoComida-1/fanesca.jpg"),
    category: "drinks",
    available: true,
    sales: 187
  }
];