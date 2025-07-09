import * as SQLite from 'expo-sqlite';
import { mockRestaurants } from '@/data/mockData';
import uuid from 'react-native-uuid';

// Abrir la base de datos de forma síncrona
const db = SQLite.openDatabaseSync('mydatabase.db');

// --- MIGRACIÓN: Agregar campo name si no existe ---
const migrateAddNameField = () => {
  const userTableInfo = db.getAllSync("PRAGMA table_info(users)");
  const hasName = userTableInfo.some((col: any) => col.name === 'name');
  if (!hasName) {
    db.runSync('ALTER TABLE users ADD COLUMN name TEXT');
  }
};

// MIGRACIÓN: Cambia todas las tablas antiguas a usar IDs TEXT (UUID/string)
export const migrateCartAndOrdersToText = () => {
  // Cart
  db.runSync('CREATE TABLE IF NOT EXISTS Cart_new (id TEXT PRIMARY KEY NOT NULL, user_id TEXT, restaurant_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
  db.runSync('INSERT INTO Cart_new (id, user_id, restaurant_id, created_at) SELECT CAST(id AS TEXT), CAST(user_id AS TEXT), CAST(restaurant_id AS TEXT), created_at FROM Cart');
  db.runSync('DROP TABLE IF EXISTS Cart');
  db.runSync('ALTER TABLE Cart_new RENAME TO Cart');

  // CartItems
  db.runSync('CREATE TABLE IF NOT EXISTS CartItems_new (id TEXT PRIMARY KEY NOT NULL, cart_id TEXT, product_id TEXT, quantity INTEGER, price DECIMAL(10,2), notes TEXT)');
  db.runSync('INSERT INTO CartItems_new (id, cart_id, product_id, quantity, price, notes) SELECT CAST(id AS TEXT), CAST(cart_id AS TEXT), CAST(product_id AS TEXT), quantity, price, notes FROM CartItems');
  db.runSync('DROP TABLE IF EXISTS CartItems');
  db.runSync('ALTER TABLE CartItems_new RENAME TO CartItems');

  // Orders
  db.runSync('CREATE TABLE IF NOT EXISTS Orders_new (id TEXT PRIMARY KEY NOT NULL, user_id TEXT, restaurant_id TEXT, status TEXT, total_amount DECIMAL(10,2), delivery_fee DECIMAL(10,2), service_fee DECIMAL(10,2), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, delivery_address TEXT, customer_name TEXT, customer_phone TEXT)');
  db.runSync('INSERT INTO Orders_new (id, user_id, restaurant_id, status, total_amount, delivery_fee, service_fee, created_at, delivery_address, customer_name, customer_phone) SELECT CAST(id AS TEXT), CAST(user_id AS TEXT), CAST(restaurant_id AS TEXT), status, total_amount, delivery_fee, service_fee, created_at, delivery_address, customer_name, customer_phone FROM Orders');
  db.runSync('DROP TABLE IF EXISTS Orders');
  db.runSync('ALTER TABLE Orders_new RENAME TO Orders');

  // OrderItems
  db.runSync('CREATE TABLE IF NOT EXISTS OrderItems_new (id TEXT PRIMARY KEY NOT NULL, order_id TEXT, product_id TEXT, quantity INTEGER, price DECIMAL(10,2), notes TEXT)');
  db.runSync('INSERT INTO OrderItems_new (id, order_id, product_id, quantity, price, notes) SELECT CAST(id AS TEXT), CAST(order_id AS TEXT), CAST(product_id AS TEXT), quantity, price, notes FROM OrderItems');
  db.runSync('DROP TABLE IF EXISTS OrderItems');
  db.runSync('ALTER TABLE OrderItems_new RENAME TO OrderItems');

  // Products
  db.runSync('CREATE TABLE IF NOT EXISTS Products_new (id TEXT PRIMARY KEY NOT NULL, restaurant_id TEXT, name TEXT, description TEXT, price DECIMAL(10,2), image_url TEXT, category TEXT, available BOOLEAN DEFAULT 1)');
  db.runSync('INSERT INTO Products_new (id, restaurant_id, name, description, price, image_url, category, available) SELECT CAST(id AS TEXT), CAST(restaurant_id AS TEXT), name, description, price, image_url, category, available FROM Products');
  db.runSync('DROP TABLE IF EXISTS Products');
  db.runSync('ALTER TABLE Products_new RENAME TO Products');
};

// MIGRACIÓN: Añadir campo order_number incremental si no existe
const migrateAddOrderNumber = () => {
  const orderTableInfo = db.getAllSync("PRAGMA table_info(Orders)");
  const hasOrderNumber = orderTableInfo.some((col: any) => col.name === 'order_number');
  if (!hasOrderNumber) {
    db.runSync('ALTER TABLE Orders ADD COLUMN order_number INTEGER');
    // Asignar números incrementales a pedidos existentes
    const orders = db.getAllSync('SELECT id FROM Orders ORDER BY created_at ASC');
    orders.forEach((order: any, idx: number) => {
      db.runSync('UPDATE Orders SET order_number = ? WHERE id = ?', [idx + 1, order.id]);
    });
  }
};

// Inicializar tablas
let dbInitialized = false;
export const initDatabase = () => {
  if (dbInitialized) return;
  try {
    migrateAddNameField();
    migrateCartAndOrdersToText();
    migrateAddOrderNumber();
    db.execSync(`
      -- ESTRUCTURA EASYFOOD RELACIONAL
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('customer', 'restaurant')),
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        address TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS restaurants (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        name TEXT,
        description TEXT,
        image_url TEXT,
        location TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY NOT NULL,
        restaurant_id TEXT NOT NULL,
        name TEXT,
        description TEXT,
        price REAL,
        image_url TEXT,
        is_available INTEGER DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
      );
      CREATE TABLE IF NOT EXISTS orders_rel (
        id TEXT PRIMARY KEY NOT NULL,
        customer_id TEXT NOT NULL,
        restaurant_id TEXT NOT NULL,
        total REAL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
      );
      CREATE TABLE IF NOT EXISTS order_items_rel (
        id TEXT PRIMARY KEY NOT NULL,
        order_id TEXT NOT NULL,
        menu_item_id TEXT NOT NULL,
        quantity INTEGER,
        subtotal REAL,
        FOREIGN KEY(order_id) REFERENCES orders_rel(id),
        FOREIGN KEY(menu_item_id) REFERENCES menu_items(id)
      );
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY NOT NULL,
        customer_id TEXT NOT NULL,
        restaurant_id TEXT NOT NULL,
        rating INTEGER,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
      );
    `);
    dbInitialized = true;
    // Insertar productos de ejemplo
    insertSampleProducts();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Función para insertar productos de ejemplo de los datos mock
const insertSampleProducts = () => {
  try {
    // Verificar si ya hay productos en la tabla
    const productsCount = db.getFirstSync('SELECT COUNT(*) as count FROM Products', []);
    
    if (productsCount && (productsCount as any)['count'] > 0) {
      // Ya hay productos, no necesitamos insertar más
      return;
    }
    
    // Insertar todos los productos de los restaurantes mock
    mockRestaurants.forEach(restaurant => {
      restaurant.menu.forEach(item => {
        // Convertir la imagen a una URL string para almacenar en la base de datos
        let imageUrl = '';
        if (typeof item.image === 'string') {
          imageUrl = item.image;
        } else {
          // Esto es una aproximación, ya que require() no devuelve un string URL
          // En un caso real, necesitaríamos manejar esto de otra manera
          imageUrl = `${restaurant.id}-${item.id}`;
        }
        
        try {
          db.runSync(
            `INSERT INTO Products (
              id, restaurant_id, name, description, price, image_url, category
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              item.id,
              restaurant.id,
              item.name,
              item.description,
              item.price,
              imageUrl,
              item.category
            ]
          );
        } catch (error) {
          // Si hay un error (por ejemplo, por duplicado de ID), lo ignoramos
          console.error('Error al insertar producto:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error inserting sample products:', error);
  }
};

// Función para agregar un producto al carrito
export const addToCart = (
  userId: string,
  restaurantId: string,
  productId: string,
  quantity: number,
  price: number,
  notes: string = ''
) => {
  try {
    // Buscar carrito existente SOLO para este usuario y restaurante
    let cartResult: any = db.getFirstSync(
      'SELECT * FROM Cart WHERE user_id = ? AND restaurant_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId, restaurantId]
    );
    let cartId = cartResult?.id;
    // Si no hay carrito, crear uno nuevo con UUID
    if (!cartId) {
      cartId = uuid.v4();
      db.runSync(
        'INSERT INTO Cart (id, user_id, restaurant_id) VALUES (?, ?, ?)',
        [cartId, userId, restaurantId]
      );
    }
    // Validación extra: si aún no hay cartId, lanzar error explícito
    if (!cartId) {
      throw new Error('No se pudo crear el carrito para el usuario');
    }
    // Verificar si el producto ya está en el carrito
    const item: any = db.getFirstSync(
      'SELECT * FROM CartItems WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    if (item) {
      const newQuantity = item.quantity + quantity;
      if (newQuantity <= 0) {
        db.runSync('DELETE FROM CartItems WHERE id = ?', [item.id]);
      } else {
        db.runSync('UPDATE CartItems SET quantity = ? WHERE id = ?', [newQuantity, item.id]);
      }
    } else if (quantity > 0) {
      const cartItemId = uuid.v4();
      db.runSync(
        'INSERT INTO CartItems (id, cart_id, product_id, quantity, price, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [cartItemId, cartId, productId, quantity, price, notes]
      );
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// --- Mejorar robustez y depuración en getCartItems ---
export const getCartItems = async (userId: string) => {
  try {
    await initDatabase(); // Asegura inicialización
    const cart: any = db.getFirstSync(
      'SELECT * FROM Cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (!cart) return []; // Si no hay carrito, retorna array vacío para que la UI muestre estado vacío
    const items = db.getAllSync(
      `SELECT 
          ci.id AS id,
          ci.product_id,
          ci.quantity,
          ci.price,
          ci.notes,
          ci.cart_id,
          p.name,
          p.image_url,
          p.restaurant_id
       FROM CartItems ci
       JOIN Products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart.id]
    );
    // Normaliza la imagen: si es ruta local, la UI debe usar require, si es URL, usar string
    return items.map((item: any) => {
      let imageType = 'unknown';
      if (typeof item.image_url === 'string') {
        if (item.image_url.startsWith('http')) {
          imageType = 'remote';
        } else if (item.image_url.startsWith('assets/') || item.image_url.startsWith('images/')) {
          imageType = 'local';
        } else {
          imageType = 'default';
        }
      }
      return {
        ...item,
        imageType,
      };
    });
  } catch (error) {
    console.error('Error getting cart items:', error);
    return []; // Siempre retorna array vacío en error para que la UI no crashee
  }
};

// Eliminar item del carrito
export const removeFromCart = (cartItemId: string) => {
  try {
    db.runSync('DELETE FROM CartItems WHERE id = ?', [cartItemId]);
    return true;
  } catch (error) {
    console.log('Error al eliminar del carrito:', error);
    return true;
  }
};

// --- Mejorar robustez y depuración en createOrder ---
export const createOrder = async (
  userId: string,
  deliveryAddress: string,
  customerName: string,
  customerPhone: string
): Promise<string> => {
  try {
    await initDatabase();
    const cart: any = db.getFirstSync(
      'SELECT * FROM Cart WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (!cart) throw new Error('No hay carrito');
    const items: any[] = db.getAllSync(
      'SELECT * FROM CartItems WHERE cart_id = ?',
      [cart.id]
    );
    if (!items.length) throw new Error('Carrito vacío');
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const serviceFee = 1.50;
    const orderId = uuid.v4();
    // Obtener el siguiente número de pedido
    const lastOrderObj = db.getFirstSync('SELECT order_number FROM Orders ORDER BY order_number DESC LIMIT 1');
    let nextOrderNumber = 1;
    if (lastOrderObj && typeof lastOrderObj === 'object' && 'order_number' in lastOrderObj && lastOrderObj.order_number != null) {
      nextOrderNumber = Number(lastOrderObj.order_number) + 1;
    }
    db.runSync(
      `INSERT INTO Orders (
        id, user_id, restaurant_id, status, total_amount,
        delivery_fee, service_fee, delivery_address,
        customer_name, customer_phone, order_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        cart.restaurant_id,
        'preparing',
        totalAmount + deliveryFee + serviceFee,
        deliveryFee,
        serviceFee,
        deliveryAddress,
        customerName,
        customerPhone,
        nextOrderNumber
      ]
    );
    // Transferir los items del carrito a la orden
    items.forEach((item: any) => {
      const orderItemId = uuid.v4();
      db.runSync(
        `INSERT INTO OrderItems (id, order_id, product_id, quantity, price, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderItemId, orderId, item.product_id, item.quantity, item.price, item.notes]
      );
    });
    // Limpiar solo el carrito del usuario actual
    clearUserCart(userId);
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error; // Lanza el error para que el frontend lo capture
  }
};

// Obtener órdenes del usuario
export const getOrders = (userId: string) => {
  try {
    return db.getAllSync(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM OrderItems WHERE order_id = o.id) as item_count
       FROM Orders o 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Obtener detalles de una orden
export const getOrderDetails = (orderId: string) => {
  try {
    const order: any = db.getFirstSync(
      `SELECT *, order_number FROM Orders WHERE id = ?`,
      [orderId]
    );
    if (!order) return null;
    const items = db.getAllSync(
      `SELECT oi.*, p.name, p.image_url
       FROM OrderItems oi
       JOIN Products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return { ...order, items };
  } catch (error) {
    console.error('Error getting order details:', error);
    return null;
  }
};

// Actualizar estado de la orden
export const updateOrderStatus = (orderId: string, status: string) => {
  try {
    db.runSync('UPDATE Orders SET status = ? WHERE id = ?', [status, orderId]);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

// Función de utilidad para ver el contenido de una tabla (para depuración)
export const logTable = (tableName: string) => {
  try {
    const rows = db.getAllSync(`SELECT * FROM ${tableName}`);
    console.log(`Contenido de la tabla ${tableName}:`, rows);
  } catch (e) {
    console.log('Error al leer la tabla', tableName, e);
  }
};

// Función para depurar CartItems - muestra todos los elementos en la tabla
export const debugCartItems = () => {
  try {
    console.log('\n===== DEPURACIÓN DE CARTITEMS =====');
    const items = db.getAllSync('SELECT * FROM CartItems', []);
    
    if (items && items.length > 0) {
      console.log(`Encontrados ${items.length} elementos en CartItems:`);
      items.forEach((item: any, index: number) => {
        console.log(`[${index}] ID: ${item.id}, product_id: ${item.product_id}, quantity: ${item.quantity}, price: ${item.price}`);
      });
    } else {
      console.log('La tabla CartItems está vacía');
    }
    console.log('===== FIN DEPURACIÓN =====\n');
    return items;
  } catch (error) {
    console.error('Error en debugCartItems:', error);
    return [];
  }
};

// ================= FUNCIONES EASYFOOD RELACIONAL ===================

// Insertar usuario
export const getUserByEmail = (email: string) => {
  const result = db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
  return result;
};

// Modificar insertUser para lanzar error si el correo ya existe
export const registerUser = (user: { id?: string, email: string, password: string, role: string }) => {
  const existing = db.getFirstSync('SELECT * FROM users WHERE email = ?', [user.email]);
  if (existing) {
    throw new Error('El correo ya está registrado');
  }
  const userId = user.id || uuid.v4();
  db.runSync(
    'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
    [userId, user.email, user.password, user.role]
  );
  return userId;
};

// Login seguro: busca usuario y valida contraseña
export const loginUser = (email: string, password: string) => {
  const user = db.getFirstSync('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    throw new Error('No existe una cuenta con ese correo');
  }
  if ((user as any).password !== password) {
    throw new Error('Contraseña incorrecta');
  }
  return user;
};

// Elimina usuario y todos sus datos relacionados (pedidos, reviews, etc)
export const deleteUserAndData = (userId: string) => {
  // Eliminar reviews
  db.runSync('DELETE FROM reviews WHERE customer_id = (SELECT id FROM customers WHERE user_id = ?)', [userId]);
  // Eliminar order_items_rel y orders_rel
  db.runSync('DELETE FROM order_items_rel WHERE order_id IN (SELECT id FROM orders_rel WHERE customer_id = (SELECT id FROM customers WHERE user_id = ?))', [userId]);
  db.runSync('DELETE FROM orders_rel WHERE customer_id = (SELECT id FROM customers WHERE user_id = ?)', [userId]);
  // Eliminar carrito y sus items
  clearUserCart(userId);
  // Eliminar customer
  db.runSync('DELETE FROM customers WHERE user_id = ?', [userId]);
  // Eliminar usuario
  db.runSync('DELETE FROM users WHERE id = ?', [userId]);
};

// Actualizar nombre de usuario
export const updateUserName = (userId: string, name: string) => {
  const db = require('expo-sqlite').openDatabaseSync('mydatabase.db');
  db.runSync('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
};

// Limpiar carrito del usuario (y sus items) al eliminar cuenta o cerrar sesión
export const clearUserCart = async (userId: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const carts = db.getAllSync('SELECT id FROM Cart WHERE user_id = ?', [userId]);
      carts.forEach((cart: any) => {
        db.runSync('DELETE FROM CartItems WHERE cart_id = ?', [cart.id]);
      });
      db.runSync('DELETE FROM Cart WHERE user_id = ?', [userId]);
      db.runSync('VACUUM'); // Limpia la base de datos y asegura que no queden residuos
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
