import React from 'react';
import { GameRoom as GameRoomType } from '../../types/game';

interface ResultsPhaseProps {
  room: GameRoomType;
  onNewGame: () => void;
  onLeaveRoom: () => void;
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ 
  room, 
  onNewGame, 
  onLeaveRoom 
}) => {
  const getVoteCount = (playerId: string) => {
    return Object.values(room.votes).filter(vote => vote === playerId).length;
  };

  const getMostVotedPlayer = () => {
    let maxVotes = 0;
    let mostVotedPlayer = room.players[0];

    room.players.forEach(player => {
      const votes = getVoteCount(player.id);
      if (votes > maxVotes) {
        maxVotes = votes;
        mostVotedPlayer = player;
      }
    });

    return { player: mostVotedPlayer, votes: maxVotes };
  };

  const getImpostor = () => {
    return room.players.find(player => player.isImpostor);
  };

  const { player: mostVotedPlayer, votes: mostVotes } = getMostVotedPlayer();
  const impostor = getImpostor();
  const wasImpostorCaught = mostVotedPlayer?.id === impostor?.id;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">¡Juego Terminado!</h1>
      
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">Resultados de la Votación</h2>
        
        <div className="mb-6">
          <p className="text-lg mb-2">
            El jugador más votado fue:
          </p>
          <div className="text-2xl font-bold mb-2">
            {mostVotedPlayer.name} {mostVotedPlayer.avatar}
          </div>
          <p className="text-gray-600">
            con {mostVotes} voto{mostVotes !== 1 ? 's' : ''}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${wasImpostorCaught ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'}`}>
          <h3 className={`text-xl font-bold ${wasImpostorCaught ? 'text-green-800' : 'text-red-800'}`}>
            {wasImpostorCaught ? '¡Correcto! El impostor fue descubierto' : '¡Incorrecto! No era el impostor'}
          </h3>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">Revelación del Impostor</h2>
        
        <div className="mb-4">
          <p className="text-lg mb-2">El impostor era:</p>
          <div className="text-3xl font-bold mb-2">
            {impostor?.name} {impostor?.avatar}
          </div>
        </div>

        <div className="grid grid-2" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="p-4 bg-blue-100 rounded-lg">
            <h4 className="font-bold mb-2">Palabra Normal</h4>
            <p className="text-lg">{room.normalWord}</p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg">
            <h4 className="font-bold mb-2">Palabra del Impostor</h4>
            <p className="text-lg">{room.impostorWord}</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Resumen de Votos</h2>
        <div className="player-list">
          {room.players.map((player) => {
            const votes = getVoteCount(player.id);
            const isImpostor = player.isImpostor;
            
            return (
              <div 
                key={player.id} 
                className={`player-card ${isImpostor ? 'border-2 border-red-500 bg-red-50' : ''}`}
              >
                <div className="text-2xl mb-2">{player.avatar}</div>
                <div className="font-bold mb-1">{player.name}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {votes} voto{votes !== 1 ? 's' : ''}
                </div>
                {isImpostor && (
                  <div className="text-xs font-bold text-red-600">
                    IMPOSTOR
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button 
          className="btn"
          onClick={onNewGame}
        >
          Nueva Partida
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onLeaveRoom}
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default ResultsPhase;
