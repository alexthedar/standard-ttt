import { useState } from "react";
import "./App.css";

const rowStyle: React.CSSProperties = {
  display: "flex",
};

const squareStyle: React.CSSProperties = {
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
};

const boardStyle: React.CSSProperties = {
  backgroundColor: "#eee",
  width: "208px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  border: "3px #eee solid",
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  height: "100vh",
  justifyContent: "center",
};

const instructionsStyle: React.CSSProperties = {
  marginTop: "5px",
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: "16px",
};

const buttonStyle: React.CSSProperties = {
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
};

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
  return null;
}

function Square({
  value,
  onClick,
}: {
  value: string | null;
  onClick: () => void;
}) {
  return (
    <div className="square" style={squareStyle} onClick={onClick}>
      {value}
    </div>
  );
}

function App() {
  const [board, setBoard] = useState<(string | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);

  const handleClick = (row: number, col: number) => {
    if (winner || board[row][col]) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = turn;
    setBoard(newBoard);

    const result = getWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  const handleReset = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setTurn("X");
    setWinner(null);
  };

  return (
    <div style={containerStyle}>
      <div style={instructionsStyle}>
        {winner ? `Winner: ${winner}` : `Next player: ${turn}`}
      </div>
      <div style={boardStyle}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={rowStyle}>
            {row.map((cell, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                onClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <button style={buttonStyle} onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default App;
