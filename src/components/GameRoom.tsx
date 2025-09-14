import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameRoom as GameRoomType, GAME_CONFIG } from '../types/game';
import { getRandomWord } from '../data/words';
import { subscribeToGameRoom, updateGameRoom, supabase } from '../lib/supabase';
import WaitingRoom from './game/WaitingRoom';
import CardRevealPhase from './game/CardRevealPhase';
import DrawingPhase from './game/DrawingPhase';
import VotingPhase from './game/VotingPhase';
import ResultsPhase from './game/ResultsPhase';

interface GameRoomProps {
  room: GameRoomType | null;
  onRoomUpdate: (room: GameRoomType) => void;
  onLeaveRoom: () => void;
}

const GameRoomComponent: React.FC<GameRoomProps> = ({ 
  room, 
  onRoomUpdate, 
  onLeaveRoom 
}) => {
  const navigate = useNavigate();
  const [localRoom, setLocalRoom] = useState<GameRoomType | null>(room);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (room) {
      setLocalRoom(room);
      setIsLoading(false);
    } else {
      // Si no hay sala, redirigir al inicio después de un breve delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [room, navigate]);

  // Separate effect for subscription to avoid re-subscribing on every room change
  useEffect(() => {
    if (!room?.id) return;

    console.log('Setting up subscription for room:', room.id);
    
    // Subscribe to real-time updates for this room
    const subscription = subscribeToGameRoom(room.id, (updatedRoom) => {
      console.log('Room data updated via subscription:', updatedRoom);
      setLocalRoom(updatedRoom);
    });
    
    return () => {
      console.log('Cleaning up subscription for room:', room.id);
      subscription.unsubscribe();
    };
  }, [room?.id]); // Only depend on room.id, not the entire room object

  const updateRoom = async (updatedRoom: GameRoomType) => {
    setLocalRoom(updatedRoom);
    onRoomUpdate(updatedRoom);
    
    // Update room in Supabase
    try {
      await updateGameRoom(updatedRoom.id, {
        phase: updatedRoom.phase,
        round: updatedRoom.round,
        current_player_index: updatedRoom.currentPlayerIndex,
        time_left: updatedRoom.timeLeft,
        is_game_started: updatedRoom.isGameStarted,
        is_voting_phase: updatedRoom.isVotingPhase,
        voting_time_left: updatedRoom.votingTimeLeft,
        impostor_word: updatedRoom.impostorWord,
        normal_word: updatedRoom.normalWord
      });
      
      // Also update players in the database
      for (const player of updatedRoom.players) {
        await supabase
          .from('players')
          .update({
            is_impostor: player.isImpostor,
            has_seen_card: player.hasSeenCard,
            attempts: player.attempts,
            is_active: player.isActive
          })
          .eq('id', player.id);
      }
    } catch (error) {
      console.error('Error updating room in database:', error);
    }
  };

  const startGame = () => {
    if (!localRoom) return;

    // Select random word for normal players
    const normalWord = getRandomWord(localRoom.selectedCategory);
    
    // Impostor always gets the word "impostor"
    const impostorWord = { word: 'impostor', category: 'special', difficulty: 'easy' as const };
    
    // Select random impostor
    const impostorIndex = Math.floor(Math.random() * localRoom.players.length);
    
    const updatedPlayers = localRoom.players.map((player, index) => ({
      ...player,
      isImpostor: index === impostorIndex
    }));

    const updatedRoom: GameRoomType = {
      ...localRoom,
      players: updatedPlayers,
      normalWord: normalWord.word,
      impostorWord: impostorWord.word,
      phase: 'cardReveal',
      isGameStarted: true
    };

    updateRoom(updatedRoom);
  };

  const startDrawingPhase = () => {
    if (!localRoom) return;

    const updatedRoom: GameRoomType = {
      ...localRoom,
      phase: 'drawing',
      currentPlayerIndex: 0,
      timeLeft: GAME_CONFIG.DRAWING_TIME
    };

    updateRoom(updatedRoom);
  };

  const nextPlayer = () => {
    if (!localRoom) return;

    // Increment attempts for current player
    const updatedPlayers = localRoom.players.map((player, index) => {
      if (index === localRoom.currentPlayerIndex) {
        return { ...player, attempts: player.attempts + 1 };
      }
      return player;
    });

    const nextIndex = (localRoom.currentPlayerIndex + 1) % localRoom.players.length;
    const isNewRound = nextIndex === 0;
    
    let updatedRoom: GameRoomType = {
      ...localRoom,
      players: updatedPlayers,
      currentPlayerIndex: nextIndex,
      timeLeft: GAME_CONFIG.DRAWING_TIME
    };

    if (isNewRound) {
      updatedRoom.round = localRoom.round + 1;
      
      // Check if all players have completed their attempts OR reached max rounds
      const allPlayersCompleted = updatedPlayers.every(
        player => player.attempts >= GAME_CONFIG.MAX_ATTEMPTS
      );

      if (allPlayersCompleted || updatedRoom.round > GAME_CONFIG.MAX_ROUNDS) {
        updatedRoom.phase = 'voting';
        updatedRoom.isVotingPhase = true;
        updatedRoom.votingTimeLeft = GAME_CONFIG.VOTING_TIME;
      }
    }

    updateRoom(updatedRoom);
  };

  const submitVote = (votedPlayerId: string) => {
    if (!localRoom) return;

    const updatedVotes = {
      ...localRoom.votes,
      [localRoom.players[localRoom.currentPlayerIndex].id]: votedPlayerId
    };

    const updatedRoom: GameRoomType = {
      ...localRoom,
      votes: updatedVotes
    };

    updateRoom(updatedRoom);
  };

  const endVoting = () => {
    if (!localRoom) return;

    const updatedRoom: GameRoomType = {
      ...localRoom,
      phase: 'results'
    };

    updateRoom(updatedRoom);
  };

  const leaveRoom = () => {
    onLeaveRoom();
    navigate('/');
  };

  if (isLoading || !localRoom) {
    return (
      <div className="container text-center">
        <div className="card">
          <h2>Cargando sala...</h2>
          <p>Si la sala no existe, serás redirigido al inicio en unos segundos.</p>
        </div>
      </div>
    );
  }

  const renderPhase = () => {
    switch (localRoom.phase) {
      case 'waiting':
        return (
          <WaitingRoom
            room={localRoom}
            onStartGame={startGame}
            onLeaveRoom={leaveRoom}
          />
        );
      case 'cardReveal':
        return (
          <CardRevealPhase
            room={localRoom}
            onStartDrawing={startDrawingPhase}
            onLeaveRoom={leaveRoom}
            currentPlayerId={localStorage.getItem('currentPlayerId') || undefined}
          />
        );
      case 'drawing':
        return (
          <DrawingPhase
            room={localRoom}
            onNextPlayer={nextPlayer}
            onLeaveRoom={leaveRoom}
            currentPlayerId={localStorage.getItem('currentPlayerId') || undefined}
          />
        );
      case 'voting':
        return (
          <VotingPhase
            room={localRoom}
            onSubmitVote={submitVote}
            onEndVoting={endVoting}
            onLeaveRoom={leaveRoom}
            currentPlayerId={localStorage.getItem('currentPlayerId') || undefined}
          />
        );
      case 'results':
        return (
          <ResultsPhase
            room={localRoom}
            onNewGame={() => {
              const newRoom: GameRoomType = {
                ...localRoom,
                phase: 'waiting',
                isGameStarted: false,
                round: 1,
                players: localRoom.players.map(p => ({
                  ...p,
                  attempts: 0,
                  hasSeenCard: false,
                  isImpostor: false
                })),
                votes: {},
                isVotingPhase: false
              };
              updateRoom(newRoom);
            }}
            onLeaveRoom={leaveRoom}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {renderPhase()}
    </div>
  );
};

export default GameRoomComponent;
