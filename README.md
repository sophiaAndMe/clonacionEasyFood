# Proyecto de Innovación y Emprendimiento

Este repositorio contiene una aplicación móvil para visualizar restaurantes en un mapa, desarrollada con React Native y Expo.

## Requisitos previos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior) o yarn
- Expo CLI (`npm install -g expo-cli`)
- Git

## Cómo clonar el repositorio

1. Abre una terminal o línea de comandos
2. Ejecuta el siguiente comando:

```bash
git clone [URL_DEL_REPOSITORIO]
```

3. Navega al directorio del proyecto:

```bash
cd project
```

## Instalación de dependencias

1. Instala las dependencias principales:

```bash
npm install
```

2. Instala las dependencias específicas necesarias:

```bash
npm install react-native-maps @react-native-community/geolocation expo-location (este no)
npm install @react-navigation/native @react-navigation/stack expo-constants
npm install react-native-svg lucide-react-native
npm install expo-sqlite 
```

## mas librerias 
npx expo install expo-image-picker
npm install uuid // genera errores (ESTE NO)
npm install --save-dev @types/uuid

npm install react-native-uuid

3. Instala las herramientas de desarrollo:

```bash
npm install -g expo-cli
npm install -g eas-cli
```

## Configuración del proyecto

1. Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus propias credenciales y configuraciones.

## Ejecución del proyecto

Para iniciar el proyecto en modo desarrollo:

```bash
npx expo start
# o
npm run start
```

Esto abrirá la interfaz de Expo Developer Tools en tu navegador. Desde allí podrás:
- Ejecutar la aplicación en un emulador de iOS/Android
- Escanear el código QR con la aplicación Expo Go en tu dispositivo físico
- Ejecutar en la web

## Construcción del APK

Para generar el archivo APK para Android, sigue estos pasos:

1. **Asegúrate de tener todo configurado**:
   ```bash
   # Verifica que tienes EAS CLI instalado
   npm install -g eas-cli

   # Inicia sesión en tu cuenta de Expo
   eas login
   ```

2. **Configura la construcción**:
   ```bash
   # Inicializa la configuración de EAS
   eas build:configure
   ```

3. **Construye el APK**:
   ```bash
   # Construye el APK usando el perfil de preview
   eas build -p android --profile preview
   ```

4. **Durante la construcción**:
   - Cuando pregunte "Generate a new Android Keystore?", selecciona "Y" (Yes)
   - Espera a que termine la construcción (puede tardar 10-15 minutos)
   - Al finalizar, recibirás un enlace para descargar el APK

5. **Instalación en dispositivo Android**:
   - Descarga el APK en tu dispositivo Android
   - Ve a Configuración > Seguridad
   - Habilita "Orígenes desconocidos" o "Instalar aplicaciones desconocidas"
   - Abre el archivo APK descargado y sigue las instrucciones de instalación

### Solución de problemas comunes en la construcción

1. **Error de permisos**: Asegúrate de que el archivo `app.json` tenga todos los permisos necesarios:
   - "INTERNET"
   - "ACCESS_COARSE_LOCATION"
   - "ACCESS_FINE_LOCATION"

2. **Error con el mapa**: Verifica que la API key de Google Maps esté correctamente configurada en:
   - `app.json` en la sección de android.config.googleMaps.apiKey
   - Las variables de entorno bajo "extra.googleMapsApiKey"

3. **Error de construcción**:
   ```bash
   # Limpia la caché y los módulos
   rm -rf node_modules
   rm package-lock.json
   npm cache clean --force
   npm install
   ```

4. **Error de assets**:
   - Asegúrate de que todos los assets estén incluidos en "assetBundlePatterns" en `app.json`
   - Verifica que las imágenes estén en los formatos correctos (png, jpg)

## Estructura del proyecto

```
project/
├── app/                  # Carpeta principal de la aplicación
│   ├── (tabs)/           # Pestañas de navegación
│   └── restaurant/       # Páginas de detalles
├── assets/               # Imágenes, fuentes y otros recursos
├── components/           # Componentes reutilizables
├── data/                 # Datos mock y utilidades relacionadas
├── hooks/                # Custom hooks
└── ...
```

## Resolución de problemas comunes

### El proyecto no se ejecuta correctamente
- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm cache clean --force` y luego `npm install`
- Reinicia el servidor de desarrollo con `--clear`: `npx expo start --clear`

### Problemas con Expo
- Asegúrate de tener la última versión de Expo CLI
- Verifica que tu dispositivo y computadora estén en la misma red WiFi

## Contribución

1. Crea una nueva rama para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y haz commit: `git commit -am 'Agrega nueva funcionalidad'`
3. Sube tus cambios: `git push origin feature/nueva-funcionalidad`
4. Envía un Pull Request para revisión

## Licencia

Este proyecto está licenciado bajo [incluir licencia]
## Que hay que hacer

1. Cambiar las fotos en general(Hay que cambiar a que sea un repositorio local), nombres(menos chat gepetoso)
2. Quitar pestañas inservibles
3. La logica de el vendedor mejorarle
