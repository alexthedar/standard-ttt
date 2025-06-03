import { describe, it, expect } from "vitest";
import { createEmptyBoard, getWinner, makeMove, type Player } from "./game";

describe("createEmptyBoard", () => {
  it("should return a 3x3 board filled with nulls", () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(3);
    expect(board.every((row) => row.length === 3)).toBe(true);
    expect(board.flat().every((cell) => cell === null)).toBe(true);
  });
});

describe("getWinner", () => {
  describe("horizontal wins", () => {
    it("returns X for top row", () => {
      const board: (Player | null)[][] = [
        ["X", "X", "X"],
        [null, "O", null],
        [null, null, "O"],
      ];
      expect(getWinner(board)).toBe("X");
    });

    it("returns O for middle row", () => {
      const board: (Player | null)[][] = [
        ["X", null, "X"],
        ["O", "O", "O"],
        [null, null, null],
      ];
      expect(getWinner(board)).toBe("O");
    });

    it("returns X for bottom row", () => {
      const board: (Player | null)[][] = [
        [null, null, null],
        ["O", null, "O"],
        ["X", "X", "X"],
      ];
      expect(getWinner(board)).toBe("X");
    });
  });

  describe("vertical wins", () => {
    it("returns X for left column", () => {
      const board: (Player | null)[][] = [
        ["X", null, null],
        ["X", "O", null],
        ["X", null, "O"],
      ];
      expect(getWinner(board)).toBe("X");
    });

    it("returns O for center column", () => {
      const board: (Player | null)[][] = [
        ["X", "O", null],
        [null, "O", null],
        ["X", "O", null],
      ];
      expect(getWinner(board)).toBe("O");
    });

    it("returns X for right column", () => {
      const board: (Player | null)[][] = [
        [null, null, "X"],
        ["O", "O", "X"],
        [null, null, "X"],
      ];
      expect(getWinner(board)).toBe("X");
    });
  });

  describe("diagonal wins", () => {
    it("returns X for top-left to bottom-right", () => {
      const board: (Player | null)[][] = [
        ["X", null, null],
        ["O", "X", null],
        ["O", null, "X"],
      ];
      expect(getWinner(board)).toBe("X");
    });

    it("returns O for top-right to bottom-left", () => {
      const board: (Player | null)[][] = [
        ["X", null, "O"],
        ["X", "O", null],
        ["O", null, "X"],
      ];
      expect(getWinner(board)).toBe("O");
    });
  });

  describe("non-win states", () => {
    it("returns draw on full board", () => {
      const board: (Player | null)[][] = [
        ["X", "O", "X"],
        ["X", "O", "O"],
        ["O", "X", "X"],
      ];
      expect(getWinner(board)).toBe("draw");
    });

    it("returns null if game is still in progress", () => {
      const board: (Player | null)[][] = [
        ["X", "O", "X"],
        ["X", null, "O"],
        ["O", "X", null],
      ];
      expect(getWinner(board)).toBe(null);
    });
  });
});

describe("makeMove", () => {
  it("places player move and returns updated board", () => {
    const board = createEmptyBoard();
    const { board: updated, winner } = makeMove(board, 1, 1, "X");
    expect(updated[1][1]).toBe("X");
    expect(winner).toBe(null);
  });

  it("does not mutate the original board", () => {
    const board = createEmptyBoard();
    const copy = JSON.stringify(board);
    makeMove(board, 0, 0, "X");
    expect(JSON.stringify(board)).toBe(copy);
  });

  it("detects a winning move", () => {
    const board: (Player | null)[][] = [
      ["X", "X", null],
      [null, "O", null],
      [null, null, "O"],
    ];
    const { winner } = makeMove(board, 0, 2, "X");
    expect(winner).toBe("X");
  });

  it("does not allow overwriting a filled cell", () => {
    const board: (Player | null)[][] = [
      ["X", null, null],
      [null, null, null],
      [null, null, null],
    ];
    const { board: updated } = makeMove(board, 0, 0, "O");
    expect(updated[0][0]).toBe("X");
  });
});
