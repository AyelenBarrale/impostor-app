-- Impostor App - Supabase Database Setup
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear tabla de salas de juego
CREATE TABLE game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phase TEXT DEFAULT 'waiting' CHECK (phase IN ('waiting', 'cardReveal', 'drawing', 'voting', 'results')),
  round INTEGER DEFAULT 1 CHECK (round > 0),
  selected_category TEXT NOT NULL,
  impostor_word TEXT,
  normal_word TEXT,
  time_left INTEGER DEFAULT 15 CHECK (time_left >= 0),
  max_attempts INTEGER DEFAULT 2 CHECK (max_attempts > 0),
  is_game_started BOOLEAN DEFAULT FALSE,
  is_voting_phase BOOLEAN DEFAULT FALSE,
  voting_time_left INTEGER DEFAULT 20 CHECK (voting_time_left >= 0)
);

-- Crear tabla de jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 20),
  avatar TEXT NOT NULL,
  is_impostor BOOLEAN DEFAULT FALSE,
  has_seen_card BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de votos
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES players(id) ON DELETE CASCADE,
  voted_player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, voter_id) -- Un jugador solo puede votar una vez por sala
);

-- Crear tabla de dibujos
CREATE TABLE drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  round INTEGER NOT NULL CHECK (round > 0),
  attempt INTEGER NOT NULL CHECK (attempt > 0),
  drawing_data TEXT NOT NULL, -- Base64 encoded drawing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_game_rooms_code ON game_rooms(code);
CREATE INDEX idx_players_room_id ON players(room_id);
CREATE INDEX idx_votes_room_id ON votes(room_id);
CREATE INDEX idx_drawings_room_id ON drawings(room_id);
CREATE INDEX idx_drawings_player_id ON drawings(player_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at en game_rooms
CREATE TRIGGER update_game_rooms_updated_at 
    BEFORE UPDATE ON game_rooms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Crear función para limpiar salas inactivas (opcional)
CREATE OR REPLACE FUNCTION cleanup_inactive_rooms()
RETURNS void AS $$
BEGIN
    DELETE FROM game_rooms 
    WHERE created_at < NOW() - INTERVAL '24 hours' 
    AND is_game_started = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Crear política RLS (Row Level Security) para game_rooms
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de salas (para unirse)
CREATE POLICY "Allow public read access to game_rooms" ON game_rooms
    FOR SELECT USING (true);

-- Permitir inserción pública de salas (para crear)
CREATE POLICY "Allow public insert access to game_rooms" ON game_rooms
    FOR INSERT WITH CHECK (true);

-- Permitir actualización pública de salas (para actualizar estado del juego)
CREATE POLICY "Allow public update access to game_rooms" ON game_rooms
    FOR UPDATE USING (true);

-- Crear política RLS para players
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Permitir acceso público a players
CREATE POLICY "Allow public access to players" ON players
    FOR ALL USING (true);

-- Crear política RLS para votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Permitir acceso público a votes
CREATE POLICY "Allow public access to votes" ON votes
    FOR ALL USING (true);

-- Crear política RLS para drawings
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;

-- Permitir acceso público a drawings
CREATE POLICY "Allow public access to drawings" ON drawings
    FOR ALL USING (true);

-- Insertar datos de ejemplo (opcional)
INSERT INTO game_rooms (code, selected_category) VALUES 
('DEMO01', 'comida'),
('TEST02', 'arte');

-- Crear vista para obtener información completa de la sala
CREATE VIEW game_room_details AS
SELECT 
    gr.*,
    COUNT(p.id) as player_count,
    COUNT(CASE WHEN p.is_impostor THEN 1 END) as impostor_count,
    COUNT(v.id) as total_votes
FROM game_rooms gr
LEFT JOIN players p ON gr.id = p.room_id AND p.is_active = true
LEFT JOIN votes v ON gr.id = v.room_id
GROUP BY gr.id;

-- Crear función para obtener estadísticas de la sala
CREATE OR REPLACE FUNCTION get_room_stats(room_code TEXT)
RETURNS TABLE (
    room_id UUID,
    code TEXT,
    player_count BIGINT,
    impostor_name TEXT,
    normal_word TEXT,
    impostor_word TEXT,
    phase TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gr.id,
        gr.code,
        COUNT(p.id) as player_count,
        (SELECT name FROM players WHERE room_id = gr.id AND is_impostor = true LIMIT 1) as impostor_name,
        gr.normal_word,
        gr.impostor_word,
        gr.phase
    FROM game_rooms gr
    LEFT JOIN players p ON gr.id = p.room_id AND p.is_active = true
    WHERE gr.code = room_code
    GROUP BY gr.id, gr.code, gr.normal_word, gr.impostor_word, gr.phase;
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE game_rooms IS 'Almacena las salas de juego y su estado actual';
COMMENT ON TABLE players IS 'Almacena los jugadores de cada sala';
COMMENT ON TABLE votes IS 'Almacena los votos de los jugadores durante la fase de votación';
COMMENT ON TABLE drawings IS 'Almacena los dibujos de los jugadores';

COMMENT ON COLUMN game_rooms.code IS 'Código único de 6 caracteres para unirse a la sala';
COMMENT ON COLUMN game_rooms.phase IS 'Fase actual del juego: waiting, cardReveal, drawing, voting, results';
COMMENT ON COLUMN players.is_impostor IS 'Indica si este jugador es el impostor';
COMMENT ON COLUMN drawings.drawing_data IS 'Datos del dibujo codificados en Base64';
