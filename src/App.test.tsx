import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import type { Mock } from "vitest";

vi.mock("./hooks/useGame");
import { useGame } from "./hooks/useGame";
import { createEmptyBoard } from "./lib/game";
import type { Player, Winner } from "./lib/game";
import userEvent from "@testing-library/user-event";

// Shared mock functions
const mockHandleClick = vi.fn();
const mockHandleReset = vi.fn();

// Helpers
function setupMockGame({
  board = createEmptyBoard(),
  turn = "X" as Player,
  winner = null as Winner | null,
} = {}) {
  (useGame as Mock).mockReturnValue({
    board,
    turn,
    winner,
    handleClick: mockHandleClick,
    handleReset: mockHandleReset,
  });
}

describe("App", () => {
  beforeEach(() => {
    mockHandleClick.mockReset();
    mockHandleReset.mockReset();
  });

  it("renders 9 empty squares", () => {
    setupMockGame();
    render(<App />);
    const squares = screen.getAllByTestId(/^square-/);
    expect(squares).toHaveLength(9);
    squares.forEach((sq) => expect(sq).toHaveTextContent(""));
  });

  it("shows correct message when it's X's turn", () => {
    setupMockGame({ turn: "X" });
    render(<App />);
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: X");
  });

  it("shows correct message when it's O's turn", () => {
    setupMockGame({ turn: "O" });
    render(<App />);
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: O");
  });

  it("displays winner message when a player wins", () => {
    setupMockGame({
      board: [
        ["X", "X", "X"],
        ["O", "O", null],
        [null, null, null],
      ],
      winner: "X",
    });
    render(<App />);
    expect(screen.getByTestId("status")).toHaveTextContent("Winner: X");
  });

  it("displays draw message on full board with no winner", () => {
    setupMockGame({
      board: [
        ["X", "O", "X"],
        ["X", "O", "O"],
        ["O", "X", "X"],
      ],
      winner: "draw",
    });
    render(<App />);
    expect(screen.getByTestId("status")).toHaveTextContent("A draw!");
  });

  it("displays an empty board and X's turn after reset", () => {
    setupMockGame(); // default is empty board, turn: X
    render(<App />);
    const squares = screen.getAllByTestId(/^square-/);
    squares.forEach((sq) => expect(sq).toHaveTextContent(""));
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: X");
  });

  it("calls handleClick when a square is clicked", async () => {
    setupMockGame();
    render(<App />);
    const square = screen.getByTestId("square-0-0");
    await userEvent.click(square);
    expect(mockHandleClick).toHaveBeenCalledWith(0, 0);
  });

  it("calls handleReset when reset button is clicked", async () => {
    setupMockGame();
    render(<App />);
    await userEvent.click(screen.getByTestId("reset-button"));
    expect(mockHandleReset).toHaveBeenCalled();
  });
});
