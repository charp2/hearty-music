import React from 'react';
import './App.css';
import { Game } from './components/game/game';

const App = () => {
  return (
    <div>
      <div className="header">
        <span className="page-title">Game of Pig</span>
      </div>
      <div className="page">
        <div className="app-container">
          <Game />
        </div>
      </div>
    </div>
  );
}

export default App;
