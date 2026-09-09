import Chess, { PieceMoves, PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import Piece from "./pieces.js";

export default class Knight extends Piece<PieceMoves> {
  name: PieceType = "knight";
  moves: string[] | null = null;

  constructor(position: string, signal: AbortSignal) {
    super(position, signal);
  }

  calculateMoves() {
    if (this.moves) return;

    // A knight moves in an L style around all directions
    // He has 8 maximum positions
    // Whether white or black, algorithm is the same

    this.moves = [];

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, -2]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, -2]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-2, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-2, 1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, 2]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, 2]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [2, 1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [2, -1]));
    } catch {}
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;
    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: [],
    };

    this.moves!.forEach((pos) => {
      const info = ChessState.boardState[pos]!;

      if (!info.pieceName) {
        this.validMoves!.move.push(pos);
        return;
      }

      if (info.pieceColor === Chess.getOppPieceColor()) {
        this.validMoves!.capture.push(pos);
      }
    });
  }

  pieceCallback(_: string): void {}
}
