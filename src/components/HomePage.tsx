import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">🎨 Impostor App</h1>
        <p className="text-xl mb-8">
          Un juego de dibujo colaborativo donde debes descubrir quién es el impostor
        </p>
        
        <div className="grid grid-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card text-center">
            <h2 className="text-xl font-bold mb-4">Crear Sala</h2>
            <p className="mb-6">
              Crea una nueva sala de juego e invita a tus amigos
            </p>
            <button 
              className="btn"
              onClick={() => navigate('/create')}
            >
              Crear Sala
            </button>
          </div>
          
          <div className="card text-center">
            <h2 className="text-xl font-bold mb-4">Unirse a Sala</h2>
            <p className="mb-6">
              Únete a una sala existente con el código de la sala
            </p>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/join')}
            >
              Unirse
            </button>
          </div>
        </div>

        <div className="card mt-6">
          <h3 className="text-lg font-bold mb-4">¿Cómo jugar?</h3>
          <div className="text-left" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <ol className="space-y-2" style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
              <li>Crea una sala o únete a una existente</li>
              <li>Selecciona tu avatar y espera a que todos se unan</li>
              <li>Elige una categoría de palabras</li>
              <li>Cada jugador verá su carta (palabra) por unos segundos</li>
              <li>¡Uno de ustedes es el impostor con una palabra diferente!</li>
              <li>Dibuja tu palabra en 15 segundos por ronda (3 rondas total)</li>
              <li>Al final, vota quién crees que es el impostor</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
