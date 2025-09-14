import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, GameRoom, AVATARS, GAME_CONFIG } from '../types/game';
import { getRoomByCode, supabase } from '../lib/supabase';

interface JoinRoomPageProps {
  onRoomJoined: (room: GameRoom) => void;
}

const JoinRoomPage: React.FC<JoinRoomPageProps> = ({ onRoomJoined }) => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) {
      alert('Por favor ingresa el código de la sala y tu nombre');
      return;
    }

    setIsJoining(true);

    try {
      // Find room by code
      const { data: room, error: roomError } = await getRoomByCode(roomCode.toUpperCase());
      
      if (roomError || !room) {
        alert(`Sala no encontrada: ${(roomError as any)?.message || 'Verifica el código.'}`);
        setIsJoining(false);
        return;
      }

      const playerId = crypto.randomUUID();
      
      const newPlayer: Player = {
        id: playerId,
        name: playerName.trim(),
        avatar: selectedAvatar,
        isImpostor: false,
        hasSeenCard: false,
        attempts: 0,
        isActive: true
      };

      // Add player to the room
      const playerData = {
        room_id: room.id,
        name: newPlayer.name,
        avatar: newPlayer.avatar,
        is_impostor: newPlayer.isImpostor,
        has_seen_card: newPlayer.hasSeenCard,
        attempts: newPlayer.attempts,
        is_active: newPlayer.isActive
      };

      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();

      if (playerError) {
        console.error('Error adding player:', playerError);
        alert(`Error al unirse a la sala: ${(playerError as any)?.message || 'Intenta de nuevo.'}`);
        setIsJoining(false);
        return;
      }

      // Map existing players from database format to app format
      const mappedExistingPlayers = (room.players || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isImpostor: p.is_impostor,
        hasSeenCard: p.has_seen_card,
        attempts: p.attempts,
        isActive: p.is_active
      }));

      // Map new player from database format to app format
      const mappedNewPlayer: Player = {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        isImpostor: player.is_impostor,
        hasSeenCard: player.has_seen_card,
        attempts: player.attempts,
        isActive: player.is_active
      };

      const gameRoom: GameRoom = {
        id: room.id,
        code: room.code,
        players: [...mappedExistingPlayers, mappedNewPlayer],
        currentPlayerIndex: 0,
        round: room.round,
        phase: room.phase as any,
        selectedCategory: room.selected_category,
        impostorWord: room.impostor_word || '',
        normalWord: room.normal_word || '',
        timeLeft: room.time_left,
        maxAttempts: room.max_attempts,
        isGameStarted: room.is_game_started,
        isVotingPhase: room.is_voting_phase,
        votes: {},
        votingTimeLeft: room.voting_time_left
      };

      // Save current player ID to localStorage (use the ID from database)
      localStorage.setItem('currentPlayerId', mappedNewPlayer.id);
      
      onRoomJoined(gameRoom);
      navigate(`/room/${gameRoom.id}`);
      setIsJoining(false);
    } catch (error) {
      console.error('Error joining room:', error);
      alert(`Error al unirse a la sala: ${(error as any)?.message || 'Intenta de nuevo.'}`);
      setIsJoining(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Unirse a Sala</h1>
        
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="mb-6">
            <label className="block text-left mb-2 font-bold">
              Código de la sala:
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ingresa el código de 6 caracteres"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-left mb-2 font-bold">
              Tu nombre:
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="mb-6">
            <label className="block text-left mb-2 font-bold">
              Selecciona tu avatar:
            </label>
            <div className="grid grid-4" style={{ gap: '8px' }}>
              {AVATARS.map((avatar, index) => (
                <div
                  key={index}
                  className={`avatar ${selectedAvatar === avatar ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  {avatar}
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn"
            onClick={joinRoom}
            disabled={!roomCode.trim() || !playerName.trim() || isJoining}
          >
            {isJoining ? 'Uniéndose...' : 'Unirse a Sala'}
          </button>
        </div>

        <div className="card mt-4">
          <h3 className="text-lg font-bold mb-2">¿No tienes código?</h3>
          <p className="mb-4">
            Pide al creador de la sala que te comparta el código de 6 caracteres
          </p>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomPage;
