import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, GameRoom, AVATARS, GAME_CONFIG } from '../types/game';
import { wordCategories } from '../data/words';
import { createGameRoom, supabase } from '../lib/supabase';

interface CreateRoomPageProps {
  onRoomCreated: (room: GameRoom) => void;
}

const CreateRoomPage: React.FC<CreateRoomPageProps> = ({ onRoomCreated }) => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedCategory, setSelectedCategory] = useState('comida');

  const generateRoomCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    const roomCode = generateRoomCode();
    const playerId = crypto.randomUUID();
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName.trim(),
      avatar: selectedAvatar,
      isImpostor: false, // Will be assigned randomly later
      hasSeenCard: false,
      attempts: 0,
      isActive: true
    };

    const roomData = {
      code: roomCode,
      phase: 'waiting',
      round: 1,
      selected_category: selectedCategory,
      impostor_word: null,
      normal_word: null,
      time_left: GAME_CONFIG.DRAWING_TIME,
      max_attempts: GAME_CONFIG.MAX_ATTEMPTS,
      is_game_started: false,
      is_voting_phase: false,
      voting_time_left: GAME_CONFIG.VOTING_TIME
    };

    try {
      console.log('Creating room with data:', roomData);
      const { data: room, error } = await createGameRoom(roomData);
      
      if (error) {
        console.error('Error creating room:', error);
        alert(`Error al crear la sala: ${(error as any)?.message || JSON.stringify(error)}. Intenta de nuevo.`);
        return;
      }

      console.log('Room created successfully:', room);

      // Add the creator as the first player
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
        alert('Error al agregar jugador. Intenta de nuevo.');
        return;
      }

      // Map player data from database format to app format
      const mappedPlayer: Player = {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        isImpostor: player.is_impostor,
        hasSeenCard: player.has_seen_card,
        attempts: player.attempts,
        isActive: player.is_active
      };

      const newRoom: GameRoom = {
        id: room.id,
        code: room.code,
        players: [mappedPlayer],
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
      localStorage.setItem('currentPlayerId', mappedPlayer.id);
      
      onRoomCreated(newRoom);
      navigate(`/room/${newRoom.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error al crear la sala. Intenta de nuevo.');
    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Crear Sala de Juego</h1>
        
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
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

          <div className="mb-6">
            <label className="block text-left mb-2 font-bold">
              Categoría de palabras:
            </label>
            <select
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.entries(wordCategories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn"
            onClick={createRoom}
            disabled={!playerName.trim()}
          >
            Crear Sala
          </button>
        </div>

        <div className="card mt-4">
          <h3 className="text-lg font-bold mb-2">Instrucciones:</h3>
          <p className="text-left">
            Una vez creada la sala, comparte el código con tus amigos para que se unan. 
            Cuando todos estén listos, podrás iniciar el juego.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPage;
