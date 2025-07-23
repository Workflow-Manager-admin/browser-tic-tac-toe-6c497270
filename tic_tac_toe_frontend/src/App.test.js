import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
});

test('plays a full game and shows winner or draw', () => {
  render(<App />);
  // Simulate moves: X, O, X, O, X, O, X
  const squares = screen.getAllByRole('button', { name: /cell/i });
  expect(squares.length).toBe(9);

  // X moves
  fireEvent.click(squares[0]);
  // O
  fireEvent.click(squares[1]);
  // X
  fireEvent.click(squares[4]);
  // O
  fireEvent.click(squares[2]);
  // X
  fireEvent.click(squares[8]);
  // Should declare X as winner (diagonal: 0,4,8)
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  // Board is now locked, clicking should not change anything
  fireEvent.click(squares[3]);
  expect(squares[3].textContent).toBe('');
});

test('restart button resets the board but keeps score', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /cell/i });
  fireEvent.click(squares[0]); // X
  fireEvent.click(squares[1]); // O
  fireEvent.click(squares[4]); // X
  fireEvent.click(squares[2]); // O
  fireEvent.click(squares[8]); // X
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  const restartBtn = screen.getByRole('button', { name: /restart/i });
  fireEvent.click(restartBtn);
  // The status text should now be "Next: X"
  expect(screen.getByText(/Next: X/i)).toBeInTheDocument();
  // All squares should be empty
  squares.forEach(sq => expect(sq.textContent).toBe(''));
});

test('reset button resets scores and board', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /cell/i });
  fireEvent.click(squares[0]); // X
  fireEvent.click(squares[1]); // O
  fireEvent.click(squares[4]); // X
  fireEvent.click(squares[2]); // O
  fireEvent.click(squares[8]); // X
  expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  // Score should now say X: 1
  expect(screen.getByText(/X: 1/)).toBeInTheDocument();
  const resetBtn = screen.getByRole('button', { name: /reset/i });
  fireEvent.click(resetBtn);
  // All scores should now be 0
  expect(screen.getByText(/X: 0/)).toBeInTheDocument();
  expect(screen.getByText(/O: 0/)).toBeInTheDocument();
  expect(screen.getByText(/Draw: 0/)).toBeInTheDocument();
  expect(screen.getByText(/Next: X/)).toBeInTheDocument();
});
