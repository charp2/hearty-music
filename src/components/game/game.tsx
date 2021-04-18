import React, { useEffect, useState } from 'react';
import { ReactComponent as D1 } from '../../static-assets/inverted-dice-1.svg';
import { ReactComponent as D2 } from '../../static-assets/inverted-dice-2.svg';
import { ReactComponent as D3 } from '../../static-assets/inverted-dice-3.svg';
import { ReactComponent as D4 } from '../../static-assets/inverted-dice-4.svg';
import { ReactComponent as D5 } from '../../static-assets/inverted-dice-5.svg';
import { ReactComponent as D6 } from '../../static-assets/inverted-dice-6.svg';
import PersonIcon from '@material-ui/icons/Person';
import ProgressBar from 'react-bootstrap/ProgressBar';

import './game.css';

const numPlayers = 2;
export interface PlayerScore {
  sessionAggregate: number;
  current: number;
}

const diceMap = {
  1: <D1 className="die"/>,
  2: <D2 className="die"/>,
  3: <D3 className="die"/>,
  4: <D4 className="die"/>,
  5: <D5 className="die"/>,
  6: <D6 className="die"/>,
};

enum GameState {
  STANDARD,
  CONTINUED,
}

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.STANDARD);
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(Array.from(Array(numPlayers)).map(() => ({
    sessionAggregate: 0,
    current: 0,
  })));
  const [turnScore, setTurnScore] = useState<number>(0);
  const [diceDisplay, setDiceDisplay] = useState<JSX.Element[]>([diceMap[1], diceMap[1]]);
  const [holdDisabled, setHoldDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (((playerScores[activePlayer].current + turnScore) >= 100) && (gameState === GameState.STANDARD)) {
      const r = window.confirm(`Player ${activePlayer+1} wins! \n\nClick OK to start a new game\nClick cancel to continue this game`);
      if (r === true) {
        newGame();
      } else {
        setGameState(GameState.CONTINUED);
      }
    } // eslint-disable-next-line
  }, [turnScore, activePlayer]);

  const newGame = () => {
    setActivePlayer(0);
    setPlayerScores(Array.from(Array(numPlayers)).map((val, idx) => ({
      sessionAggregate: playerScores[idx].current + playerScores[idx].sessionAggregate + turnScore,
      current: 0,
    })));
    setTurnScore(0);
    setDiceDisplay([diceMap[1], diceMap[1]]);
    setHoldDisabled(false);
  };

  const onDiceRoll = () => {
    setHoldDisabled(false);
    const results = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    setDiceDisplay(results.map(result => (diceMap as any)[result]));

    let onesCount = 0;
    let doubles = false;
    const resultSet = new Set();
    results.forEach(result => {
      if (result === 1) onesCount++;
      if (resultSet.has(result)) doubles = true;
      resultSet.add(result);
    });

    if (onesCount === 1) {
      setTurnScore(0);
      setActivePlayer(prevState => (prevState + 1) % numPlayers);
    } else if (onesCount === 2) { // snake-eyes
      setTurnScore(0);
      setPlayerScores(prevState => prevState.map((playerScore, idx) => { 
        if (idx === activePlayer) { 
          return { ...playerScore, current: 0 }
        } else return playerScore
      }));
      setActivePlayer(prevState => (prevState + 1) % numPlayers);
    } else if (doubles) {
      setHoldDisabled(true);
      setTurnScore(prevScore => prevScore + results.reduce((acc, result) => result+acc, 0));
    } else {
      setTurnScore(prevScore => prevScore + results.reduce((acc, result) => result+acc, 0));
    }

  };

  const onHold = () => {
    setPlayerScores(prevState => prevState.map((playerScore, idx) => { 
      if (idx === activePlayer) { 
        return { ...playerScore, current: playerScore.current + turnScore }
      } else return playerScore
    }));
    setActivePlayer(prevState => (prevState + 1) % numPlayers);
    setTurnScore(0);
  };

  return (
    <>
      <div className="game-container">
        <div className="score-section">
          <div className="total-scores">
            {Array.from(Array(numPlayers)).map((val, idx) => {
              return (
                <div className={`total-score${activePlayer === idx ? ' total-score-active' : ''}`} onClick={() => { alert(`player ${idx+1} aggregate score (across games): ${playerScores[idx].sessionAggregate}`)}}>
                  <div>{`Player ${idx+1}`}</div>
                  <PersonIcon style={{ color: 'white', height: '5em', width: '5em' }}/>
                  <>
                    {playerScores[idx].current}
                    <ProgressBar style={{ width: '75%', height: '0.75em' }}>
                      <ProgressBar now={playerScores[idx].current} key={1} />
                      {activePlayer === idx && <ProgressBar style={{ opacity: 0.4 }} now={turnScore} key={2} />}
                    </ProgressBar>
                  </>
                </div>
              )
            })}
          </div>
          <div className="turn-score">
            <div className="turn-score-background">{turnScore}</div>
          </div>
        </div>
        <div className="dice-section">
          {diceDisplay}
        </div>
        <div className="action-section">
          <div className="reset-button-container">
            <button className="button reset-button" onClick={newGame}>New game</button>
          </div>
          <div className="game-action-buttons">
            <button className="button roll-button" onClick={onDiceRoll} >Roll</button>
            <button disabled={holdDisabled} className="button hold-button" onClick={onHold} >Hold</button>
          </div>
        </div>
      </div>
    </>
  );
}

