import React, { useState, useEffect } from 'react';
import { GameRoom as GameRoomType } from '../../types/game';
import PlayerCard from './PlayerCard';

interface CardRevealPhaseProps {
  room: GameRoomType;
  onStartDrawing: () => void;
  onLeaveRoom: () => void;
  currentPlayerId?: string;
}

const CardRevealPhase: React.FC<CardRevealPhaseProps> = ({ 
  room, 
  onStartDrawing, 
  onLeaveRoom,
  currentPlayerId
}) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasSeenCard, setHasSeenCard] = useState(false);

  // Add safety check for room data FIRST
  console.log('CardRevealPhase - room:', room);
  console.log('CardRevealPhase - room.players:', room?.players);
  console.log('CardRevealPhase - currentPlayerId:', currentPlayerId);
  
  if (!room || !room.players) {
    console.log('CardRevealPhase - Room or players not available, showing loading state');
    return (
      <div className="text-center">
        <div className="card">
          <h2>Cargando datos de la sala...</h2>
          <p>Espera un momento mientras se cargan los datos.</p>
        </div>
      </div>
    );
  }

  const currentPlayer = currentPlayerId ? room.players.find(p => p.id === currentPlayerId) : null;
  console.log('CardRevealPhase - currentPlayer:', currentPlayer);

  const startGame = () => {
    onStartDrawing();
  };

  if (showInstructions) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Instrucciones del Juego</h1>
        
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="text-xl font-bold mb-4">¿Cómo jugar?</h2>
          <div className="text-left space-y-3">
            <p>1. <strong>Uno de ustedes es el impostor</strong> - tendrá una palabra diferente</p>
            <p>2. <strong>Los demás tienen la misma palabra</strong> - deben dibujarla</p>
            <p>3. <strong>El impostor debe dibujar la palabra normal</strong> para no ser descubierto</p>
            <p>4. <strong>Cada jugador dibuja 2 veces</strong> en total</p>
            <p>5. <strong>Tienes 15 segundos</strong> para cada dibujo</p>
            <p>6. <strong>Al final vota</strong> quién crees que es el impostor</p>
          </div>
          
          <button 
            className="btn mt-6"
            onClick={() => setShowInstructions(false)}
          >
            Entendido, continuar
          </button>
        </div>
      </div>
    );
  }

  if (!hasSeenCard && currentPlayer) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Revelación de Cartas</h1>
        
        {/* Player Card - Show individual word */}
        <PlayerCard room={room} currentPlayerId={currentPlayerId} />
        
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 className="text-xl font-bold mb-4">
            {currentPlayer.name} {currentPlayer.avatar}
          </h2>
          
          <div className="mb-6">
            <p className="text-lg mb-4">Tu palabra es:</p>
            <div className="text-3xl font-bold p-6 bg-yellow-100 rounded-lg border-2 border-yellow-300">
              {currentPlayer.isImpostor ? room.impostorWord : room.normalWord}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Memoriza tu palabra. No la compartas con otros jugadores.
            </p>
          </div>

          <button 
            className="btn"
            onClick={() => setHasSeenCard(true)}
          >
            He visto mi palabra
          </button>
        </div>

        <div className="card mt-4">
          <p className="text-sm text-gray-600">
            Esperando a que todos los jugadores vean sus cartas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">¡Todos han visto sus cartas!</h1>
      
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="text-xl font-bold mb-4">¿Listos para comenzar?</h2>
        <p className="mb-6">
          Ahora cada jugador dibujará su palabra en 15 segundos por ronda.
          ¡Uno de ustedes es el impostor!
        </p>

        <button 
          className="btn"
          onClick={startGame}
        >
          Iniciar Dibujo
        </button>
      </div>
    </div>
  );
};

export default CardRevealPhase;
