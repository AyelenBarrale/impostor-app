import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameRoom as GameRoomType, GAME_CONFIG } from '../../types/game';
import { saveDrawing } from '../../lib/supabase';
import DrawingsGallery from './DrawingsGallery';
import PlayerCard from './PlayerCard';

interface DrawingPhaseProps {
  room: GameRoomType;
  onNextPlayer: () => void;
  onLeaveRoom: () => void;
  currentPlayerId?: string;
}

const DrawingPhase: React.FC<DrawingPhaseProps> = ({ 
  room, 
  onNextPlayer, 
  onLeaveRoom,
  currentPlayerId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(room.timeLeft);
  const [currentPlayer, setCurrentPlayer] = useState(room.players[room.currentPlayerIndex]);
  const [attempt, setAttempt] = useState(1);

  const nextPlayer = useCallback(async () => {
    // Save drawing to Supabase
    if (currentPlayerId && canvasRef.current) {
      const canvas = canvasRef.current;
      const drawingData = canvas.toDataURL('image/png');
      
      try {
        await saveDrawing(room.id, currentPlayerId, room.round, attempt, drawingData);
        console.log('Drawing saved successfully');
      } catch (error) {
        console.error('Error saving drawing:', error);
      }
    }
    
    onNextPlayer();
  }, [currentPlayerId, room.id, room.round, attempt, onNextPlayer]);

  const handleTimeUp = useCallback(() => {
    nextPlayer();
  }, [nextPlayer]);

  useEffect(() => {
    setCurrentPlayer(room.players[room.currentPlayerIndex]);
    setTimeLeft(room.timeLeft);
    setAttempt(room.players[room.currentPlayerIndex].attempts + 1);
  }, [room.currentPlayerIndex, room.players, room.timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleTimeUp]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Fase de Dibujo</h1>
      
      {/* Player Card - Show individual word */}
      <PlayerCard room={room} currentPlayerId={currentPlayerId} />
      
      <div className="game-info">
        <div>
          <h2 className="text-xl font-bold">
            {currentPlayer.name} {currentPlayer.avatar}
          </h2>
          <p className="text-sm text-gray-600">
            Intento {attempt} de {GAME_CONFIG.MAX_ATTEMPTS}
          </p>
        </div>
        
        <div className="timer">
          {formatTime(timeLeft)}
        </div>
        
        <div className="attempt-counter">
          Ronda {room.round} de {GAME_CONFIG.MAX_ROUNDS}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">Dibuja tu palabra</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              cursor: 'crosshair',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white'
            }}
          />
        </div>
        
        <div className="flex gap-4 justify-center mt-4">
          <button 
            className="btn btn-secondary"
            onClick={clearCanvas}
          >
            Limpiar
          </button>
          <button 
            className="btn"
            onClick={nextPlayer}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Drawings Gallery - Show all drawings in real-time */}
      <DrawingsGallery 
        roomId={room.id} 
        players={room.players} 
        currentRound={room.round} 
      />

      <div className="card mt-4">
        <h3 className="text-lg font-bold mb-4">Jugadores</h3>
        <div className="player-list">
          {room.players.map((player, index) => (
            <div 
              key={player.id} 
              className={`player-card ${index === room.currentPlayerIndex ? 'active' : ''}`}
            >
              <div className="text-2xl mb-2">{player.avatar}</div>
              <div className="font-bold">{player.name}</div>
              <div className="text-sm text-gray-600">
                {player.attempts}/{GAME_CONFIG.MAX_ATTEMPTS} intentos
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button 
          className="btn btn-secondary"
          onClick={onLeaveRoom}
        >
          Abandonar Juego
        </button>
      </div>
    </div>
  );
};

export default DrawingPhase;
