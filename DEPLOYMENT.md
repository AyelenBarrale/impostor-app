# 🚀 Guía de Despliegue - Impostor App

## Opciones de Hosting Recomendadas

### 1. **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Seguir las instrucciones en pantalla
```

### 2. **Netlify**
1. Conecta tu repositorio de GitHub
2. Configura el build command: `npm run build`
3. Configura el publish directory: `build`
4. Despliega

### 3. **Railway**
1. Conecta tu repositorio
2. Railway detectará automáticamente que es una app React
3. Despliega

## Configuración de Supabase

### 1. Configurar URLs de Producción
En tu proyecto de Supabase:
1. Ve a **Settings** > **API**
2. En **Site URL**, agrega tu dominio de producción
3. En **Additional Redirect URLs**, agrega tu dominio de producción

### 2. Variables de Entorno
Crea un archivo `.env.production` con:
```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima
```

## Cómo Funciona el Multijugador

### ✅ Funcionalidades Implementadas:
1. **Sesiones Independientes**: Cada jugador tiene su propia sesión
2. **Código de Sala**: Los jugadores se unen con un código único
3. **Cartas Individuales**: Cada jugador ve solo su palabra
4. **Dibujos en Tiempo Real**: Todos ven los dibujos al instante
5. **Votación Sincronizada**: Todos votan desde su dispositivo

### 🎮 Flujo del Juego:
1. **Creador**: Crea sala y comparte código
2. **Jugadores**: Se unen con el código
3. **Inicio**: Cada uno ve su carta individual
4. **Dibujo**: Todos dibujan en su turno
5. **Galería**: Todos ven los dibujos en tiempo real
6. **Votación**: Todos votan desde su dispositivo
7. **Resultados**: Se muestran a todos

## Comandos de Despliegue

### Build Local
```bash
./build.sh
```

### Build Manual
```bash
npm run build
```

### Verificar Build
```bash
# Instalar servidor local
npm install -g serve

# Servir build local
serve -s build
```

## URLs de Ejemplo
- **Desarrollo**: `http://localhost:3000`
- **Producción**: `https://tu-app.vercel.app`

## Solución de Problemas

### Si los jugadores no se sincronizan:
1. Verifica que Supabase esté configurado correctamente
2. Revisa las URLs permitidas en Supabase
3. Verifica que las variables de entorno estén configuradas

### Si los dibujos no aparecen:
1. Verifica que la tabla `drawings` exista en Supabase
2. Revisa los permisos RLS (Row Level Security)
3. Verifica la conexión a Supabase

## Estructura de la Base de Datos
- `game_rooms`: Salas de juego
- `players`: Jugadores en cada sala
- `votes`: Votos de cada jugador
- `drawings`: Dibujos de cada jugador
- `word_categories`: Categorías de palabras
- `words`: Palabras del juego
