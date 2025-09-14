export interface Player {
  id: string;
  name: string;
  avatar: string;
  isImpostor: boolean;
  hasSeenCard: boolean;
  attempts: number;
  isActive: boolean;
}

export interface GameRoom {
  id: string;
  code: string;
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  phase: GamePhase;
  selectedCategory: string;
  impostorWord: string;
  normalWord: string;
  timeLeft: number;
  maxAttempts: number;
  isGameStarted: boolean;
  isVotingPhase: boolean;
  votes: Record<string, string>; // playerId -> votedPlayerId
  votingTimeLeft: number;
}

export type GamePhase = 
  | 'waiting' 
  | 'cardReveal' 
  | 'drawing' 
  | 'voting' 
  | 'results';

export interface DrawingData {
  playerId: string;
  round: number;
  attempt: number;
  drawing: string; // Base64 encoded drawing
  timestamp: number;
}

export const AVATARS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉',
  '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋'
];

export const GAME_CONFIG = {
  DRAWING_TIME: 15, // seconds
  VOTING_TIME: 20, // seconds
  MAX_ATTEMPTS: 3, // 3 intentos por jugador
  MAX_ROUNDS: 3, // 3 rondas
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 8
};
