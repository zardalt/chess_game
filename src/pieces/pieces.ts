import { PieceType } from "../chess.js";

export default abstract class Piece {
  abstract name: PieceType;
  abstract calculateMoves(): void;
  abstract calculateValidMoves(): void;
  abstract addEventListeners(): void;

  signal;
  position;
  moves: string[] | null = null;
  validMoves: string[] | null = null;

  constructor(signal: AbortSignal, position: string) {
    this.signal = signal;
    this.position = position;
  }
}
