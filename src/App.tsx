import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateRoomPage from './components/CreateRoomPage';
import JoinRoomPage from './components/JoinRoomPage';
import GameRoom from './components/GameRoom';
import { GameRoom as GameRoomType } from './types/game';

function App() {
  const [currentRoom, setCurrentRoom] = useState<GameRoomType | null>(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/create" 
            element={<CreateRoomPage onRoomCreated={setCurrentRoom} />} 
          />
          <Route 
            path="/join" 
            element={<JoinRoomPage onRoomJoined={setCurrentRoom} />} 
          />
          <Route 
            path="/room/:roomId" 
            element={
              <GameRoom 
                room={currentRoom} 
                onRoomUpdate={setCurrentRoom}
                onLeaveRoom={() => setCurrentRoom(null)}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
