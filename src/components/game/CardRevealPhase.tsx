import React, { useState, useEffect } from 'react';
import { GameRoom as GameRoomType } from '../../types/game';

interface CardRevealPhaseProps {
  room: GameRoomType;
  onStartDrawing: () => void;
  onLeaveRoom: () => void;
}

const CardRevealPhase: React.FC<CardRevealPhaseProps> = ({ 
  room, 
  onStartDrawing, 
  onLeaveRoom 
}) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [allPlayersHaveSeenCard, setAllPlayersHaveSeenCard] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentPlayer = room.players[currentPlayerIndex];
  const isCurrentPlayer = true; // In a real app, this would check if it's the current user

  useEffect(() => {
    // Check if all players have seen their cards
    const allSeen = room.players.every(player => player.hasSeenCard);
    setAllPlayersHaveSeenCard(allSeen);
  }, [room.players]);

  const handleCardReveal = () => {
    // In a real app, this would update the player's hasSeenCard status
    // For now, we'll just simulate it
    if (currentPlayerIndex < room.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      setAllPlayersHaveSeenCard(true);
    }
  };

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

  if (!allPlayersHaveSeenCard) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Revelación de Cartas</h1>
        
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 className="text-xl font-bold mb-4">
            Turno de: {currentPlayer.name} {currentPlayer.avatar}
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
            onClick={handleCardReveal}
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
