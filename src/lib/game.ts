export type Player = "X" | "O";
export type Winner = Player | "draw";

export function createEmptyBoard(): (Player | null)[][] {
  return Array.from({ length: 3 }, () => Array(3).fill(null));
}

export function getWinner(board: (Player | null)[][]): Winner | null {
  const lines = [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const [a, b, c] of lines) {
    if (a && a === b && b === c) return a;
  }

  const isFull = board.every((row) => row.every((cell) => cell !== null));
  return isFull ? "draw" : null;
}

export function makeMove(
  board: (Player | null)[][],
  row: number,
  col: number,
  player: Player
): {
  board: (Player | null)[][];
  winner: Winner | null;
} {
  if (board[row][col] !== null) {
    return {
      board: board.map((r) => [...r]),
      winner: getWinner(board),
    };
  }

  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;

  return {
    board: newBoard,
    winner: getWinner(newBoard),
  };
}

export function boardToFirestore(
  board: (Player | null)[][]
): Record<string, Player | null> {
  const flat: Record<string, Player | null> = {};
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      flat[`${row}-${col}`] = board[row][col];
    }
  }
  return flat;
}

export function boardFromFirestore(
  flat: Record<string, Player | null>
): (Player | null)[][] {
  const board = createEmptyBoard();
  Object.entries(flat).forEach(([key, value]) => {
    const [row, col] = key.split("-").map(Number);
    board[row][col] = value;
  });
  return board;
}
