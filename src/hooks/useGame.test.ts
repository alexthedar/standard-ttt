import { renderHook, act } from "@testing-library/react";
import { useGame } from "./useGame";
import { onSnapshot, updateDoc, setDoc, doc } from "firebase/firestore";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";

// Mock Firebase methods
vi.mock("firebase/firestore", async () => {
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    doc: vi.fn(),
    onSnapshot: vi.fn(),
    updateDoc: vi.fn(),
    setDoc: vi.fn(),
    getFirestore: vi.fn(() => "mock-firestore"), // ✅ add this
    serverTimestamp: () => "mock-timestamp",
  };
});

// Mock game logic
vi.mock("../lib/game", async () => {
  const actual = await vi.importActual("../lib/game");
  return {
    ...actual,
    createEmptyBoard: () => [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    makeMove: vi.fn().mockReturnValue({
      board: [
        ["X", null, null],
        [null, null, null],
        [null, null, null],
      ],
      winner: null,
    }),
    boardToFirestore: (b: unknown) => b,
    boardFromFirestore: (b: unknown) => b,
  };
});

describe("useGame", () => {
  const unsubscribe = vi.fn();

  beforeEach(() => {
    (doc as Mock).mockReturnValue("mock-doc-ref");

    (onSnapshot as Mock).mockImplementation(
      (_docRef: unknown, callback: (snap: { data: () => unknown }) => void) => {
        callback({
          data: () => ({
            board: [
              ["X", null, null],
              [null, "O", null],
              [null, null, null],
            ],
            turn: "O",
            winner: null,
          }),
        });
        return unsubscribe;
      }
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("initializes and listens to Firestore updates", () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.board[0][0]).toBe("X");
    expect(result.current.turn).toBe("O");
    expect(result.current.winner).toBeNull();
    expect(onSnapshot).toHaveBeenCalled();
  });

  it("calls updateDoc on handleClick", async () => {
    const { result } = renderHook(() => useGame());

    await act(() => result.current.handleClick(0, 1));
    expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", expect.any(Object));
  });

  it("calls setDoc on handleReset", async () => {
    const { result } = renderHook(() => useGame());

    await act(() => result.current.handleReset());
    expect(setDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        board: expect.anything(),
        turn: "X",
        winner: null,
        players: { X: "someUserId", O: null },
      })
    );
  });
  it("calls updateDoc on handleClick", async () => {
    const { result } = renderHook(() => useGame());

    await act(() => result.current.handleClick(0, 1)); // <-- use empty cell!
    expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", expect.any(Object));
  });

  it("does not call updateDoc if cell is already filled", async () => {
    const { result } = renderHook(() => useGame());

    await act(() => result.current.handleClick(0, 0)); // already filled
    expect(updateDoc).not.toHaveBeenCalled();
  });
});
