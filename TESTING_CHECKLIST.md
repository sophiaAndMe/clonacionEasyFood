# Checklist de Verificación - EasyFood APK

## ✅ Pre-Build Checklist

### Base de Datos
- [x] Base de datos se inicializa en `_layout.tsx`
- [x] Funciones `addToCart` y `removeFromCart` son async
- [x] Manejo robusto de errores en operaciones de BD
- [x] Logging detallado habilitado

### Cart Functionality
- [x] CartContext maneja errores apropiadamente
- [x] `addItem` y `removeItem` tienen logging detallado
- [x] Estado de loading manejado correctamente
- [x] Fallbacks locales implementados

### UI Components
- [x] Botones + y - en restaurant screen
- [x] Botones + y - en cart screen
- [x] Pantalla de tarjeta de crédito implementada
- [x] Navegación entre pantallas funcional

## ✅ Testing en APK - Checklist

### Test 1: Agregar Productos desde Restaurant
- [ ] Abrir restaurant screen
- [ ] Presionar botón "+" en un producto
- [ ] Verificar que la cantidad aparece
- [ ] Presionar "+" varias veces
- [ ] Verificar que la cantidad incrementa correctamente
- [ ] Ir al carrito y verificar que el producto está ahí

### Test 2: Quitar Productos desde Restaurant
- [ ] Con productos en el carrito
- [ ] Presionar botón "-" en restaurant screen
- [ ] Verificar que la cantidad disminuye
- [ ] Cuando cantidad llegue a 0, verificar que desaparece
- [ ] Verificar en cart screen que los cambios persisten

### Test 3: Modificar Cantidades en Cart Screen
- [ ] Ir a cart screen con productos
- [ ] Presionar botón "+" en un item
- [ ] Verificar que cantidad aumenta inmediatamente
- [ ] Presionar botón "-" en un item
- [ ] Verificar que cantidad disminuye immediatamente
- [ ] Reducir cantidad a 0 y verificar que item se elimina

### Test 4: Persistencia de Datos
- [ ] Agregar varios productos al carrito
- [ ] Cerrar completamente la app (swipe up)
- [ ] Reabrir la app
- [ ] Verificar que todos los productos siguen en el carrito
- [ ] Verificar que las cantidades son correctas

### Test 5: Tarjeta de Crédito
- [ ] Ir a cart screen
- [ ] Presionar "Tarjeta de Crédito"
- [ ] Verificar que se abre la nueva pantalla
- [ ] Intentar llenar campos con datos inválidos
- [ ] Verificar que aparecen mensajes de error
- [ ] Llenar todos los campos correctamente
- [ ] Presionar "Aceptar"
- [ ] Verificar que regresa al carrito

### Test 6: Error Handling
- [ ] Intentar usar la app sin conexión a internet
- [ ] Verificar que los botones siguen funcionando
- [ ] Verificar que aparecen mensajes informativos si hay errores
- [ ] Verificar que la app no se crashea

### Test 7: Performance
- [ ] Agregar y quitar productos rápidamente
- [ ] Verificar que no hay delays perceptibles
- [ ] Verificar que la UI responde inmediatamente
- [ ] Verificar que no hay bloqueos de UI

## 🚨 Problemas a Verificar Específicamente

### Buttons No Responding
Si los botones + y - no responden:
1. Verificar logs en consola
2. Buscar errores de "addToCart" o "removeFromCart"
3. Verificar que la base de datos se inicializó correctamente
4. Verificar que no hay errores de tipos/casting

### Database Errors
Si aparecen errores de "no such table":
1. Verificar logs de inicialización en `_layout.tsx`
2. Buscar mensajes "Inicializando base de datos..."
3. Verificar que todas las migraciones se ejecutaron
4. Verificar que las tablas se crearon exitosamente

### Navigation Issues
Si la navegación de tarjeta de crédito no funciona:
1. Verificar que la ruta `/cart/credit-card` es válida
2. Verificar que el archivo existe en `app/cart/credit-card.tsx`
3. Verificar que no hay errores de TypeScript

## 📋 Reporte de Testing

Después de testing, completar:

### Funcionalidad Básica
- [ ] ✅ Botones + y - funcionan
- [ ] ✅ Carrito persiste datos
- [ ] ✅ Navegación fluida
- [ ] ❌ Problema encontrado: _____________

### Performance
- [ ] ✅ Respuesta inmediata de UI
- [ ] ✅ No hay bloqueos
- [ ] ✅ Carga rápida
- [ ] ❌ Problema encontrado: _____________

### Error Handling
- [ ] ✅ Errores se manejan gracefully
- [ ] ✅ Mensajes informativos al usuario
- [ ] ✅ App no se crashea
- [ ] ❌ Problema encontrado: _____________

### Nuevas Funcionalidades
- [ ] ✅ Tarjeta de crédito funcional
- [ ] ✅ Validación de formulario
- [ ] ✅ Navegación correcta
- [ ] ❌ Problema encontrado: _____________

## 📞 Support

Si encuentras problemas:

1. **Revisar logs**: Busca mensajes de console.log en la salida
2. **Revisar README**: Sección de troubleshooting actualizada
3. **Rebuild con cache limpia**: `eas build -p android --profile preview --clear-cache`
4. **Verificar documentación**: Revisar `CHEQUEO_GENERAL.md`
