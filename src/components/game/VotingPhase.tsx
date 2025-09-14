import React, { useState, useEffect } from 'react';
import { GameRoom as GameRoomType, GAME_CONFIG } from '../../types/game';
import { submitVote, supabase } from '../../lib/supabase';

interface VotingPhaseProps {
  room: GameRoomType;
  onSubmitVote: (playerId: string) => void;
  onEndVoting: () => void;
  onLeaveRoom: () => void;
  currentPlayerId?: string; // Add current player ID
}

const VotingPhase: React.FC<VotingPhaseProps> = ({ 
  room, 
  onSubmitVote, 
  onEndVoting, 
  onLeaveRoom,
  currentPlayerId
}) => {
  const [timeLeft, setTimeLeft] = useState(room.votingTimeLeft);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedPlayerId, setVotedPlayerId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>(room.votes || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user has already voted
  useEffect(() => {
    if (currentPlayerId && votes[currentPlayerId]) {
      setHasVoted(true);
      setVotedPlayerId(votes[currentPlayerId]);
    }
  }, [votes, currentPlayerId]);

  // Check if all players have voted
  useEffect(() => {
    const totalPlayers = room.players.length;
    const totalVotes = Object.keys(votes).length;
    
    console.log('Vote check:', { totalPlayers, totalVotes, votes });
    
    if (totalVotes >= totalPlayers && totalPlayers > 0) {
      // All players have voted, end voting immediately
      const timeoutId = setTimeout(() => {
        onEndVoting();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [votes, room.players.length, onEndVoting]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onEndVoting();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onEndVoting]);

  // Load initial votes and subscribe to changes
  useEffect(() => {
    const loadVotes = async () => {
      const { data: votesData } = await supabase
        .from('votes')
        .select('voter_id, voted_player_id')
        .eq('room_id', room.id);
      
      if (votesData) {
        const votesMap: Record<string, string> = {};
        votesData.forEach(vote => {
          votesMap[vote.voter_id] = vote.voted_player_id;
        });
        setVotes(votesMap);
      }
    };

    // Load initial votes
    loadVotes();

    // Subscribe to vote changes
    const subscription = supabase
      .channel(`votes-${room.id}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${room.id}` },
        loadVotes
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [room.id]);

  const handleVote = async (playerId: string) => {
    if (hasVoted || isSubmitting || !currentPlayerId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await submitVote(room.id, currentPlayerId, playerId);
      
      if (error) {
        console.error('Error submitting vote:', error);
        alert(`Error al votar: ${(error as any)?.message || 'Error desconocido'}`);
        return;
      }

      // Update local state immediately for better UX
      setVotedPlayerId(playerId);
      setHasVoted(true);
      
      // Update local votes state
      setVotes(prev => ({
        ...prev,
        [currentPlayerId]: playerId
      }));
      
      // Update parent component
      onSubmitVote(playerId);
      
      // Reload votes from database to ensure sync
      setTimeout(async () => {
        const { data: votesData } = await supabase
          .from('votes')
          .select('voter_id, voted_player_id')
          .eq('room_id', room.id);
        
        if (votesData) {
          const votesMap: Record<string, string> = {};
          votesData.forEach(vote => {
            votesMap[vote.voter_id] = vote.voted_player_id;
          });
          setVotes(votesMap);
        }
      }, 500);
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error al votar. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVoteCount = (playerId: string) => {
    return Object.values(votes).filter(vote => vote === playerId).length;
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">¿Quién es el Impostor?</h1>
      
      <div className="voting-section">
        <div className="timer mb-6">
          {formatTime(timeLeft)}
        </div>
        
        <p className="text-lg mb-6">
          Vota por el jugador que crees que es el impostor
        </p>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Votos: {Object.keys(votes).length} / {room.players.length} jugadores
          </p>
        </div>

        <div className="player-list">
          {room.players.map((player) => {
            const voteCount = getVoteCount(player.id);
            const isVoted = votedPlayerId === player.id;
            
            return (
              <div key={player.id} className="player-card">
                <div className="text-3xl mb-2">{player.avatar}</div>
                <div className="font-bold mb-2">{player.name}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {voteCount} voto{voteCount !== 1 ? 's' : ''}
                </div>
                <button
                  className={`vote-button ${isVoted ? 'voted' : ''}`}
                  onClick={() => handleVote(player.id)}
                  disabled={hasVoted || isSubmitting}
                >
                  {isSubmitting ? 'Votando...' : isVoted ? '✓ Votado' : 'Votar'}
                </button>
              </div>
            );
          })}
        </div>

        {hasVoted && (
          <div className="mt-6">
            <p className="text-green-600 font-bold">
              ¡Voto registrado! Esperando a que todos voten...
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Faltan {room.players.length - Object.keys(votes).length} votos
            </p>
          </div>
        )}

        {Object.keys(votes).length >= room.players.length && (
          <div className="mt-6">
            <p className="text-blue-600 font-bold">
              ¡Todos han votado! Calculando resultados...
            </p>
          </div>
        )}

        <div className="mt-6">
          <button 
            className="btn btn-secondary"
            onClick={onLeaveRoom}
          >
            Abandonar Juego
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingPhase;
