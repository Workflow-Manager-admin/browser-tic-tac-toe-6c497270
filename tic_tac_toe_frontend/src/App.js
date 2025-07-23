import React, { useState } from 'react';
import './App.css';

/**
 * ScoreBoard displays the current scores for X, O and draws.
 * @param {Object} props - xWins, oWins, draws, currentPlayer
 */
function ScoreBoard({ xWins, oWins, draws, currentPlayer }) {
  return (
    <div className="scoreboard">
      <div>
        <span className={`score-label${currentPlayer === 'X' ? ' active' : ''}`}>X</span>: <span className="score">{xWins}</span>
      </div>
      <div>
        <span className="score-label draw">Draw</span>: <span className="score">{draws}</span>
      </div>
      <div>
        <span className={`score-label${currentPlayer === 'O' ? ' active' : ''}`}>O</span>: <span className="score">{oWins}</span>
      </div>
    </div>
  );
}

/**
 * Square represents a single cell in the Tic Tac Toe board.
 * @param {Object} props - value, onClick, disabled, highlight
 */
function Square({ value, onClick, disabled, highlight }) {
  return (
    <button
      className={`square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

/**
 * Board displays the 3x3 Tic Tac Toe grid.
 * @param {Object} props - squares, onSquareClick, winningLine, disabled
 */
function Board({ squares, onSquareClick, winningLine, disabled }) {
  const renderSquare = index => (
    <Square
      key={index}
      value={squares[index]}
      onClick={() => onSquareClick(index)}
      disabled={!!squares[index] || disabled}
      highlight={winningLine && winningLine.includes(index)}
    />
  );

  return (
    <div className="board">
      {[0, 1, 2].map(row =>
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

/**
 * Checks for a win, returns an array of indices if found, or null if not.
 * @param {string[]} squares 
 * @returns {number[]|null}
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * Main App component for Tic Tac Toe game.
 * - Modern, minimalistic, centered layout.
 * - Scoreboard at top, responsive.
 * - Light theme using #1565c0, #fdd835, #e0e0e0.
 * - Two player mode, win/draw logic, and reset.
 */
function App() {
  // States for board, player turn, winner, score, draw count
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const winningLine = calculateWinner(squares);
  const winner = winningLine ? squares[winningLine[0]] : null;
  const isDraw = !winner && squares.every(Boolean);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (squares[index] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);

    // Handle win/draw logic after move
    const winLine = calculateWinner(nextSquares);
    if (winLine) {
      if (nextSquares[winLine[0]] === 'X') setXWins(xWins + 1);
      else setOWins(oWins + 1);
    } else if (nextSquares.every(Boolean)) {
      setDraws(draws + 1);
    }
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setXWins(0);
    setOWins(0);
    setDraws(0);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="tictactoe-container">
      <main className="tictactoe-main">
        <h1 className="title">Tic Tac Toe</h1>
        <ScoreBoard
          xWins={xWins}
          oWins={oWins}
          draws={draws}
          currentPlayer={winner || isDraw ? null : (xIsNext ? 'X' : 'O')}
        />
        <div className="status" aria-live="polite">{status}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
          disabled={!!winner || isDraw}
        />
        <div className="button-row">
          <button className="restart-btn" onClick={handleRestart} aria-label="Restart game">Restart</button>
          <button className="reset-btn" onClick={handleReset} aria-label="Reset scores and board">Reset All</button>
        </div>
        <footer className="footer">
          <span>Modern React Tic Tac Toe &ndash; Minimal Design</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
