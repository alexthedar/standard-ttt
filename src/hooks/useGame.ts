// hooks/useGame.ts
import { useEffect, useState, useCallback } from "react";
import {
  createEmptyBoard,
  makeMove,
  boardToFirestore,
  boardFromFirestore,
  type Player,
  type Winner,
} from "../lib/game";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export function useGame() {
  const gameRef = doc(db, "games", "test-game");
  const [board, setBoard] = useState<(Player | null)[][]>(createEmptyBoard());
  const [turn, setTurn] = useState<Player>("X");
  const [winner, setWinner] = useState<Winner | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(gameRef, (doc) => {
      const data = doc.data();
      if (!data) return;
      setBoard(boardFromFirestore(data.board));
      setTurn(data.turn);
      setWinner(data.winner);
    });
    return () => unsub();
  }, []);

  const handleClick = useCallback(
    async (row: number, col: number) => {
      if (board[row][col] || winner) return;

      const { board: updated, winner: result } = makeMove(
        board,
        row,
        col,
        turn
      );

      await updateDoc(gameRef, {
        board: boardToFirestore(updated),
        turn: result ? turn : turn === "X" ? "O" : "X",
        winner: result,
        updatedAt: serverTimestamp(),
      });
    },
    [board, turn, winner]
  );

  const handleReset = async () => {
    await setDoc(gameRef, {
      board: boardToFirestore(createEmptyBoard()),
      turn: "X",
      winner: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      players: { X: "someUserId", O: null },
    });
  };

  return { board, turn, winner, handleClick, handleReset };
}
