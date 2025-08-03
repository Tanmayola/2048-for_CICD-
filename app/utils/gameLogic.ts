export type Cell = number | null;
export type Board = Cell[][];

export const BOARD_SIZE = 4;
export const WINNING_TILE = 2048;

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
};

export const addRandomTile = (board: Board): Board => {
  const emptyCells: [number, number][] = [];
  
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === null) {
        emptyCells.push([i, j]);
      }
    }
  }
  
  if (emptyCells.length === 0) return board;
  
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  
  return newBoard;
};

export const initializeBoard = (): Board => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

export const moveLeft = (board: Board): { newBoard: Board; score: number } => {
  const newBoard = board.map(row => {
    const filtered = row.filter(cell => cell !== null);
    const merged: Cell[] = [];
    
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i]! * 2);
        i++; // Skip next element
      } else {
        merged.push(filtered[i]);
      }
    }
    
    while (merged.length < BOARD_SIZE) {
      merged.push(null);
    }
    
    return merged;
  });
  
  const score = calculateScore(board, newBoard);
  return { newBoard, score };
};

export const moveRight = (board: Board): { newBoard: Board; score: number } => {
  const newBoard = board.map(row => {
    const filtered = row.filter(cell => cell !== null);
    const merged: Cell[] = [];
    
    for (let i = filtered.length - 1; i >= 0; i--) {
      if (i > 0 && filtered[i] === filtered[i - 1]) {
        merged.unshift(filtered[i]! * 2);
        i--; // Skip previous element
      } else {
        merged.unshift(filtered[i]);
      }
    }
    
    while (merged.length < BOARD_SIZE) {
      merged.unshift(null);
    }
    
    return merged;
  });
  
  const score = calculateScore(board, newBoard);
  return { newBoard, score };
};

export const moveUp = (board: Board): { newBoard: Board; score: number } => {
  const newBoard = createEmptyBoard();
  
  for (let col = 0; col < BOARD_SIZE; col++) {
    const column = board.map(row => row[col]).filter(cell => cell !== null);
    const merged: Cell[] = [];
    
    for (let i = 0; i < column.length; i++) {
      if (i < column.length - 1 && column[i] === column[i + 1]) {
        merged.push(column[i]! * 2);
        i++; // Skip next element
      } else {
        merged.push(column[i]);
      }
    }
    
    while (merged.length < BOARD_SIZE) {
      merged.push(null);
    }
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      newBoard[row][col] = merged[row];
    }
  }
  
  const score = calculateScore(board, newBoard);
  return { newBoard, score };
};

export const moveDown = (board: Board): { newBoard: Board; score: number } => {
  const newBoard = createEmptyBoard();
  
  for (let col = 0; col < BOARD_SIZE; col++) {
    const column = board.map(row => row[col]).filter(cell => cell !== null);
    const merged: Cell[] = [];
    
    for (let i = column.length - 1; i >= 0; i--) {
      if (i > 0 && column[i] === column[i - 1]) {
        merged.unshift(column[i]! * 2);
        i--; // Skip previous element
      } else {
        merged.unshift(column[i]);
      }
    }
    
    while (merged.length < BOARD_SIZE) {
      merged.unshift(null);
    }
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      newBoard[row][col] = merged[row];
    }
  }
  
  const score = calculateScore(board, newBoard);
  return { newBoard, score };
};

const calculateScore = (oldBoard: Board, newBoard: Board): number => {
  let score = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (newBoard[i][j] !== null && newBoard[i][j] !== oldBoard[i][j]) {
        score += newBoard[i][j]!;
      }
    }
  }
  return score;
};

export const canMove = (board: Board): boolean => {
  // Check for empty cells
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === null) return true;
    }
  }
  
  // Check for possible merges
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const current = board[i][j];
      if (current === null) continue;
      
      // Check right neighbor
      if (j < BOARD_SIZE - 1 && board[i][j + 1] === current) return true;
      // Check bottom neighbor
      if (i < BOARD_SIZE - 1 && board[i + 1][j] === current) return true;
    }
  }
  
  return false;
};

export const hasWon = (board: Board): boolean => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === WINNING_TILE) return true;
    }
  }
  return false;
};

export const isGameOver = (board: Board): boolean => {
  return !canMove(board);
};

export const getBestScore = (): number => {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('2048-best-score') || '0');
};

export const setBestScore = (score: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('2048-best-score', score.toString());
}; 