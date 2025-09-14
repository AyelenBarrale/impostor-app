import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface Drawing {
  id: string;
  room_id: string;
  player_id: string;
  round: number;
  attempt: number;
  drawing_data: string;
  created_at: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface DrawingsGalleryProps {
  roomId: string;
  players: Player[];
  currentRound: number;
}

const DrawingsGallery: React.FC<DrawingsGalleryProps> = ({ 
  roomId, 
  players, 
  currentRound 
}) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDrawings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('drawings')
        .select('*')
        .eq('room_id', roomId)
        .eq('round', currentRound)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDrawings(data || []);
    } catch (error) {
      console.error('Error loading drawings:', error);
    } finally {
      setLoading(false);
    }
  }, [roomId, currentRound]);

  // Load initial drawings
  useEffect(() => {
    loadDrawings();
  }, [loadDrawings]);

  // Subscribe to drawing changes
  useEffect(() => {
    const subscription = supabase
      .channel(`drawings-${roomId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drawings', filter: `room_id=eq.${roomId}` },
        loadDrawings
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId, loadDrawings]);

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Jugador desconocido';
  };

  const getPlayerAvatar = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.avatar : '❓';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">Cargando dibujos...</div>
      </div>
    );
  }

  if (drawings.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500">Aún no hay dibujos en esta ronda</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold mb-4 text-center">
        Dibujos de la Ronda {currentRound}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drawings.map((drawing) => (
          <div key={drawing.id} className="border rounded-lg p-3">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{getPlayerAvatar(drawing.player_id)}</span>
              <span className="font-medium">{getPlayerName(drawing.player_id)}</span>
              <span className="ml-auto text-sm text-gray-500">
                Intento {drawing.attempt}
              </span>
            </div>
            <div className="border rounded p-2 bg-gray-50">
              <img 
                src={drawing.drawing_data} 
                alt={`Dibujo de ${getPlayerName(drawing.player_id)}`}
                className="w-full h-32 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawingsGallery;
