import Chess, { KingMoves, PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import Piece from "./pieces.js";

export default class King extends Piece<KingMoves> {
  name: PieceType = "king";
  moves: string[] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);
  }

  calculateMoves(): void {
    if (this.moves) return;

    this.moves = [];

    try {
      this.moves.push(Chess.offsetPosition(this.position, [0, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [0, 1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, 0]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, 0]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, 1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, 1]));
    } catch {}
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;
    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: [],
      castle: [],
    };

    for (const pos of this.moves!) {
      const { pieceName, pieceColor } = ChessState.boardState[pos]!;

      if (!pieceName) {
        this.validMoves.move.push(pos);
      } else if (pieceColor === Chess.getOppPieceColor()) {
        this.validMoves.capture.push(pos);
      }
    }
  }

  pieceCallback(to: string): void {}
}
