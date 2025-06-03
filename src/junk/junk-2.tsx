import { useState, useMemo } from "react";

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    justifyContent: "center",
  } as const,

  board: {
    backgroundColor: "#eee",
    width: "208px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    border: "3px #eee solid",
  } as const,

  row: {
    display: "flex",
  } as const,

  square: {
    width: "60px",
    height: "60px",
    backgroundColor: "#ddd",
    margin: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    color: "white",
    cursor: "pointer",
  } as const,

  instructions: {
    marginTop: "5px",
    marginBottom: "5px",
    fontWeight: "bold",
    fontSize: "16px",
  } as const,

  button: {
    marginTop: "15px",
    marginBottom: "16px",
    width: "80px",
    height: "40px",
    backgroundColor: "#8acaca",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  } as const,
};

type Player = "X" | "O";

function getWinner(board: (string | null)[][]): string | null {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    )
      return board[i][0];
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    )
      return board[0][i];
  }
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2])
    return board[0][0];
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0])
    return board[0][2];

  const isBoardFull = board.every((row) => row.every((cell) => cell !== null));
  if (isBoardFull) return "draw";
  return null;
}

const emptyBoard: (string | null)[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function App() {
  const [board, setBoard] = useState<(string | null)[][]>(emptyBoard);
  const [turn, setTurn] = useState<Player>("X");

  const winner = useMemo(() => getWinner(board), [board]);
  const handleClick = (row: number, col: number) => {
    if (winner || board[row][col]) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = turn;
    setBoard(newBoard);

    if (!getWinner(newBoard)) {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  const handleReset = () => {
    setBoard(emptyBoard);
    setTurn("X");
  };

  const renderSquare = (value: string | null, onClick: () => void) => (
    <div style={styles.square} onClick={onClick}>
      {value}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.instructions}>
        {winner ? `Winner: ${winner}` : `Next player: ${turn}`}
      </div>
      <div style={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) =>
              renderSquare(cell, () => handleClick(rowIndex, colIndex))
            )}
          </div>
        ))}
      </div>
      <button style={styles.button} onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default App;
