-- Script para arreglar las suscripciones en tiempo real
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que RLS esté habilitado pero con políticas correctas
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes y crear nuevas más permisivas
DROP POLICY IF EXISTS "Allow public access to game_rooms" ON game_rooms;
DROP POLICY IF EXISTS "Allow public update access to game_rooms" ON game_rooms;
DROP POLICY IF EXISTS "Allow public access to players" ON players;
DROP POLICY IF EXISTS "Allow public access to votes" ON votes;
DROP POLICY IF EXISTS "Allow public access to drawings" ON drawings;

-- 3. Crear políticas más permisivas para desarrollo
CREATE POLICY "Enable all access for game_rooms" ON game_rooms
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for players" ON players
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for votes" ON votes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for drawings" ON drawings
    FOR ALL USING (true) WITH CHECK (true);

-- 4. Verificar que las tablas tengan los triggers necesarios para realtime
-- (Esto debería estar habilitado por defecto en Supabase)

-- 5. Verificar configuración de realtime
-- Ir a Settings > API > Realtime y asegurarse de que esté habilitado

-- 6. Verificar que las tablas estén en la lista de tablas de realtime
-- Ir a Database > Replication y verificar que las tablas estén habilitadas
