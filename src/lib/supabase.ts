import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Debug: Log the configuration
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for the game
export interface Database {
  public: {
    Tables: {
      game_rooms: {
        Row: {
          id: string;
          code: string;
          created_at: string;
          updated_at: string;
          phase: string;
          round: number;
          selected_category: string;
          impostor_word: string;
          normal_word: string;
          time_left: number;
          max_attempts: number;
          is_game_started: boolean;
          is_voting_phase: boolean;
          voting_time_left: number;
        };
        Insert: {
          id?: string;
          code: string;
          created_at?: string;
          updated_at?: string;
          phase?: string;
          round?: number;
          selected_category: string;
          impostor_word?: string;
          normal_word?: string;
          time_left?: number;
          max_attempts?: number;
          is_game_started?: boolean;
          is_voting_phase?: boolean;
          voting_time_left?: number;
        };
        Update: {
          id?: string;
          code?: string;
          created_at?: string;
          updated_at?: string;
          phase?: string;
          round?: number;
          selected_category?: string;
          impostor_word?: string;
          normal_word?: string;
          time_left?: number;
          max_attempts?: number;
          is_game_started?: boolean;
          is_voting_phase?: boolean;
          voting_time_left?: number;
        };
      };
      players: {
        Row: {
          id: string;
          room_id: string;
          name: string;
          avatar: string;
          is_impostor: boolean;
          has_seen_card: boolean;
          attempts: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          name: string;
          avatar: string;
          is_impostor?: boolean;
          has_seen_card?: boolean;
          attempts?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          name?: string;
          avatar?: string;
          is_impostor?: boolean;
          has_seen_card?: boolean;
          attempts?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          room_id: string;
          voter_id: string;
          voted_player_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          voter_id: string;
          voted_player_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          voter_id?: string;
          voted_player_id?: string;
          created_at?: string;
        };
      };
      drawings: {
        Row: {
          id: string;
          room_id: string;
          player_id: string;
          round: number;
          attempt: number;
          drawing_data: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          player_id: string;
          round: number;
          attempt: number;
          drawing_data: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          player_id?: string;
          round?: number;
          attempt?: number;
          drawing_data?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Real Supabase operations
export const createGameRoom = async (roomData: any) => {
  try {
    const { data, error } = await supabase
      .from('game_rooms')
      .insert([roomData])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating game room:', error);
    return { data: null, error };
  }
};

export const joinGameRoom = async (roomCode: string, playerData: any) => {
  try {
    // First, find the room by code
    const { data: room, error: roomError } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('code', roomCode)
      .single();
    
    if (roomError) throw roomError;
    if (!room) throw new Error('Room not found');

    // Add player to the room
    const { data, error } = await supabase
      .from('players')
      .insert([{ ...playerData, room_id: room.id }])
      .select()
      .single();
    
    if (error) throw error;
    return { data: { ...data, room }, error: null };
  } catch (error) {
    console.error('Error joining game room:', error);
    return { data: null, error };
  }
};

export const updateGameRoom = async (roomId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('game_rooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating game room:', error);
    return { data: null, error };
  }
};

export const subscribeToGameRoom = (roomId: string, callback: (room: any) => void) => {
  const subscription = supabase
    .channel(`room-${roomId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
      (payload) => {
        callback(payload.new);
      }
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
      async () => {
        // Reload room data when players change
        const { data: room } = await supabase
          .from('game_rooms')
          .select(`
            *,
            players (*)
          `)
          .eq('id', roomId)
          .single();
        
        if (room) callback(room);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(subscription);
    }
  };
};

export const getRoomByCode = async (roomCode: string) => {
  try {
    const { data, error } = await supabase
      .from('game_rooms')
      .select(`
        *,
        players (*)
      `)
      .eq('code', roomCode)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting room by code:', error);
    return { data: null, error };
  }
};

export const submitVote = async (roomId: string, voterId: string, votedPlayerId: string) => {
  try {
    // First, try to delete any existing vote from this voter
    await supabase
      .from('votes')
      .delete()
      .eq('room_id', roomId)
      .eq('voter_id', voterId);

    // Then insert the new vote
    const { data, error } = await supabase
      .from('votes')
      .insert([{ room_id: roomId, voter_id: voterId, voted_player_id: votedPlayerId }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting vote:', error);
    return { data: null, error };
  }
};

export const saveDrawing = async (roomId: string, playerId: string, round: number, attempt: number, drawingData: string) => {
  try {
    const { data, error } = await supabase
      .from('drawings')
      .insert([{ room_id: roomId, player_id: playerId, round, attempt, drawing_data: drawingData }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving drawing:', error);
    return { data: null, error };
  }
};
