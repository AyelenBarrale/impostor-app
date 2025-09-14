# 🎨 Impostor App - Juego de Dibujo Colaborativo

Una aplicación web de dibujo colaborativo donde los jugadores deben descubrir quién es el impostor. Desarrollada con React, TypeScript y Supabase.

## 🎮 ¿Cómo Jugar?

1. **Crear o Unirse a una Sala**: Crea una nueva sala o únete con un código de 6 caracteres
2. **Seleccionar Avatar**: Elige tu avatar favorito de la colección disponible
3. **Ver tu Carta**: Cada jugador ve su palabra por unos segundos (uno es el impostor con palabra diferente)
4. **Dibujar**: Cada jugador tiene 15 segundos para dibujar su palabra (2 intentos por ronda)
5. **Votar**: Al final, todos votan quién creen que es el impostor
6. **Descubrir**: Se revela quién era realmente el impostor

## 🚀 Características

- ✅ **Multiplayer en tiempo real** con Supabase (NECESARIO para funcionalidad completa)
- ✅ **Canvas de dibujo** con herramientas básicas
- ✅ **Sistema de temporizador** (15 segundos por dibujo)
- ✅ **Múltiples categorías** de palabras en español
- ✅ **Sistema de votación** para descubrir al impostor
- ✅ **Interfaz responsive** y moderna
- ✅ **Gestión de salas** con códigos únicos

### ⚠️ **Sin Supabase**:
- Solo funciona localmente (un solo jugador)
- No hay sincronización entre dispositivos
- Funcionalidad limitada para demostración

## 📚 Categorías de Palabras

- 🍕 **Comida**: pizza, hamburguesa, tacos, paella, etc.
- 🎨 **Arte**: pintura, escultura, museo, pincel, etc.
- 🎵 **Música**: guitarra, piano, batería, violín, etc.
- 🎬 **Películas**: actor, director, guión, escena, etc.
- ⚽ **Deportes**: fútbol, baloncesto, tenis, natación, etc.
- 🐶 **Animales**: perro, gato, elefante, león, etc.
- 💻 **Tecnología**: computadora, internet, robot, etc.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 con diseño responsive
- **Canvas**: HTML5 Canvas para dibujo
- **Backend**: Supabase (gratuito y seguro)
- **Routing**: React Router DOM
- **Estado**: React Hooks (useState, useEffect)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd impostor-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase (Recomendado)

**IMPORTANTE**: Para funcionalidad multiplayer en tiempo real, Supabase es **NECESARIO**:

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. Copiar la URL y clave anónima
4. Actualizar `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'tu-url-de-supabase';
const supabaseAnonKey = 'tu-clave-anonima';
```

### 4. Ejecutar la aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Base de Datos (Supabase)

### Tablas necesarias:

```sql
-- Salas de juego
CREATE TABLE game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  phase TEXT DEFAULT 'waiting',
  round INTEGER DEFAULT 1,
  selected_category TEXT NOT NULL,
  impostor_word TEXT,
  normal_word TEXT,
  time_left INTEGER DEFAULT 15,
  max_attempts INTEGER DEFAULT 2,
  is_game_started BOOLEAN DEFAULT FALSE,
  is_voting_phase BOOLEAN DEFAULT FALSE,
  voting_time_left INTEGER DEFAULT 20
);

-- Jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  is_impostor BOOLEAN DEFAULT FALSE,
  has_seen_card BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Votos
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES players(id) ON DELETE CASCADE,
  voted_player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dibujos
CREATE TABLE drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  attempt INTEGER NOT NULL,
  drawing_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Funcionalidades Implementadas

- [x] Creación y unión a salas
- [x] Selección de avatares
- [x] Base de datos de palabras por categorías
- [x] Sistema de revelación de cartas
- [x] Canvas de dibujo con temporizador
- [x] Gestión de rondas e intentos
- [x] Sistema de votación
- [x] Revelación del impostor
- [x] Interfaz responsive
- [x] Configuración de Supabase

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear archivo `.env.local`:

```env
REACT_APP_SUPABASE_URL=tu-url-de-supabase
REACT_APP_SUPABASE_ANON_KEY=tu-clave-anonima
```

### Personalización
- Modificar `src/data/words.ts` para agregar nuevas categorías
- Ajustar `src/types/game.ts` para cambiar configuraciones del juego
- Personalizar estilos en `src/index.css`

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles (iOS/Android)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🎉 ¡Disfruta Jugando!

¡Invita a tus amigos y diviértete descubriendo quién es el impostor! 🕵️‍♀️🎨
