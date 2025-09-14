import React from 'react';
import { GameRoom as GameRoomType, GAME_CONFIG } from '../../types/game';

interface WaitingRoomProps {
  room: GameRoomType;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ 
  room, 
  onStartGame, 
  onLeaveRoom 
}) => {
  const canStartGame = room.players.length >= GAME_CONFIG.MIN_PLAYERS;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Sala de Juego</h1>
      
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Código de la Sala</h2>
        <div className="text-3xl font-bold mb-4" style={{ 
          letterSpacing: '4px',
          background: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          {room.code}
        </div>
        <p className="text-sm text-gray-600">
          Comparte este código con tus amigos para que se unan
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Jugadores ({room.players.length}/{GAME_CONFIG.MAX_PLAYERS})</h2>
        <div className="player-list">
          {room.players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="text-2xl mb-2">{player.avatar}</div>
              <div className="font-bold">{player.name}</div>
            </div>
          ))}
        </div>
        
        {room.players.length < GAME_CONFIG.MIN_PLAYERS && (
          <p className="text-red-600 mt-4">
            Se necesitan al menos {GAME_CONFIG.MIN_PLAYERS} jugadores para comenzar
          </p>
        )}
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Configuración</h2>
        <div className="text-left" style={{ maxWidth: '300px', margin: '0 auto' }}>
          <p><strong>Categoría:</strong> {room.selectedCategory}</p>
          <p><strong>Rondas:</strong> {GAME_CONFIG.MAX_ROUNDS}</p>
          <p><strong>Intentos por ronda:</strong> {GAME_CONFIG.MAX_ATTEMPTS}</p>
          <p><strong>Tiempo por dibujo:</strong> {GAME_CONFIG.DRAWING_TIME}s</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button 
          className="btn"
          onClick={onStartGame}
          disabled={!canStartGame}
        >
          Iniciar Juego
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onLeaveRoom}
        >
          Abandonar Sala
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;
