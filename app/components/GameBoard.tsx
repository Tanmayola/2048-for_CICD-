'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Board,
  GameState,
  initializeBoard,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addRandomTile,
  hasWon,
  isGameOver,
  getBestScore,
  setBestScore,
} from '../utils/gameLogic';

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
  });

  useEffect(() => {
    const bestScore = getBestScore();
    setGameState(prev => ({ ...prev, bestScore }));
  }, []);

  const handleMove = useCallback((moveFunction: (board: Board) => { newBoard: Board; score: number }) => {
    setGameState(prev => {
      const { newBoard, score } = moveFunction(prev.board);
      
      // Check if the board actually changed
      const boardChanged = JSON.stringify(newBoard) !== JSON.stringify(prev.board);
      
      if (!boardChanged) return prev;
      
      // Add a new random tile
      const updatedBoard = addRandomTile(newBoard);
      
      // Update score
      const newScore = prev.score + score;
      const newBestScore = Math.max(prev.bestScore, newScore);
      
      // Check win/lose conditions
      const won = hasWon(updatedBoard);
      const gameOver = isGameOver(updatedBoard);
      
      // Update best score in localStorage
      if (newBestScore > prev.bestScore) {
        setBestScore(newBestScore);
      }
      
      return {
        ...prev,
        board: updatedBoard,
        score: newScore,
        bestScore: newBestScore,
        won,
        gameOver,
      };
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameState.gameOver && !gameState.won) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handleMove(moveLeft);
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleMove(moveRight);
        break;
      case 'ArrowUp':
        event.preventDefault();
        handleMove(moveUp);
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleMove(moveDown);
        break;
    }
  }, [gameState.gameOver, gameState.won, handleMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      score: 0,
      bestScore: gameState.bestScore,
      gameOver: false,
      won: false,
    });
  };

  const continueGame = () => {
    setGameState(prev => ({ ...prev, won: false }));
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">2048</h1>
        <div className="game-stats">
          <div className="stat">
            <div className="stat-label">Score</div>
            <div className="stat-value">{gameState.score}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Best</div>
            <div className="stat-value">{gameState.bestScore}</div>
          </div>
        </div>
      </div>

      <div className="game-board">
        <div className="board-grid">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell ? `tile-${cell}` : ''}`}
              >
                {cell || ''}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="game-controls">
        <button className="btn" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className="instructions">
        <p>Use arrow keys to move tiles. Combine tiles with the same number to reach 2048!</p>
      </div>

      {gameState.won && (
        <div className="game-over">
          <div className="game-over-content">
            <h2 className="game-over-title">You Won! 🎉</h2>
            <div className="game-over-score">Score: {gameState.score}</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn" onClick={continueGame}>
                Continue Playing
              </button>
              <button className="btn" onClick={resetGame}>
                New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.gameOver && !gameState.won && (
        <div className="game-over">
          <div className="game-over-content">
            <h2 className="game-over-title">Game Over 😔</h2>
            <div className="game-over-score">Final Score: {gameState.score}</div>
            <button className="btn" onClick={resetGame}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 