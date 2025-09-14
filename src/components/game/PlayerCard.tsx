import React, { useState, useEffect } from 'react';
import { GameRoom as GameRoomType } from '../../types/game';

interface PlayerCardProps {
  room: GameRoomType;
  currentPlayerId?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ room, currentPlayerId }) => {
  const [showCard, setShowCard] = useState(false);
  const [cardWord, setCardWord] = useState<string>('');

  useEffect(() => {
    if (!currentPlayerId) return;

    const currentPlayer = room.players.find(p => p.id === currentPlayerId);
    if (!currentPlayer) return;

    // Determine the word based on whether the player is the impostor
    if (currentPlayer.isImpostor) {
      setCardWord('IMPOSTOR');
    } else {
      setCardWord(room.normalWord);
    }
  }, [room, currentPlayerId]);

  const handleShowCard = () => {
    setShowCard(true);
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowCard(false);
    }, 3000);
  };

  if (!currentPlayerId) {
    return null;
  }

  const currentPlayer = room.players.find(p => p.id === currentPlayerId);
  if (!currentPlayer) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleShowCard}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        Ver Mi Carta
      </button>
      
      {showCard && (
        <div className="absolute top-12 right-0 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-xl min-w-[200px]">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Tu palabra es:</div>
            <div className={`text-2xl font-bold ${currentPlayer.isImpostor ? 'text-red-600' : 'text-green-600'}`}>
              {cardWord}
            </div>
            {currentPlayer.isImpostor && (
              <div className="text-xs text-red-500 mt-2">
                ¡Eres el impostor! Dibuja algo diferente
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
