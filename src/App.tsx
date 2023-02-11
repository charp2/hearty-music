import React from 'react';
import './App.css';
import { Game } from './components/game/game';

const App = () => {
  return (
    <div>
      <div className="header">
        <span className="page-title">Hearty Music</span>
      </div>
      <div className="page">
        <div className="app-container">
        </div>
      </div>
    </div>
  );
}

export default App;
