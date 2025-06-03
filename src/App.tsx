import { type Player, type Winner } from "./lib/game";
import { useGame } from "./hooks/useGame"; // 👈 NEW

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
    fontFamily: "monospace",
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

const Square = ({
  value,
  onClick,
  row,
  col,
}: {
  value: string | null;
  onClick: () => void;
  row: number;
  col: number;
}) => (
  <div
    data-testid={`square-${row}-${col}`}
    style={styles.square}
    onClick={onClick}
  >
    {value}
  </div>
);

const Row = ({
  row,
  rowIndex,
  onCellClick,
}: {
  row: (Player | null)[];
  rowIndex: number;
  onCellClick: (row: number, col: number) => void;
}) => (
  <div style={styles.row} data-testid={`row-${rowIndex}`}>
    {row.map((cell, colIndex) => (
      <Square
        key={`${rowIndex}-${colIndex}`}
        row={rowIndex}
        col={colIndex}
        value={cell}
        onClick={() => onCellClick(rowIndex, colIndex)}
      />
    ))}
  </div>
);

const Board = ({
  board,
  onCellClick,
}: {
  board: (Player | null)[][];
  onCellClick: (row: number, col: number) => void;
}) => (
  <div style={styles.board} data-testid="board">
    {board.map((row, rowIndex) => (
      <Row
        key={rowIndex}
        row={row}
        rowIndex={rowIndex}
        onCellClick={onCellClick}
      />
    ))}
  </div>
);

const GameStatus = ({
  winner,
  turn,
}: {
  winner: Winner | null;
  turn: Player;
}) => {
  let message: string;

  if (winner === "draw") {
    message = "A draw!";
  } else if (winner) {
    message = `Winner: ${winner}`;
  } else {
    message = `Next player: ${turn}`;
  }

  return (
    <div style={styles.instructions} data-testid="status">
      {message}
    </div>
  );
};

const Button = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button style={styles.button} onClick={onClick} data-testid="reset-button">
    {label}
  </button>
);

function App() {
  const { board, turn, winner, handleClick, handleReset } = useGame();

  return (
    <div style={styles.container} data-testid="app">
      <GameStatus winner={winner} turn={turn} />
      <Board board={board} onCellClick={handleClick} />
      <Button label="Reset" onClick={handleReset} />
    </div>
  );
}

export default App;
