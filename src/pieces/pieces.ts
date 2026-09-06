import { PieceType } from "../chess.js";

export default abstract class Piece<T> {
  abstract name: PieceType;
  abstract calculateMoves(): void;
  abstract calculateValidMoves(): void;
  abstract addEventListeners(): void;

  signal;
  position;
  moves: string[] | null = null;
  validMoves: T | null = null;

  constructor(position: string, signal?: AbortSignal) {
    this.signal = signal;
    this.position = position;
  }
}
