import Chess, { PieceMoves, PieceType, RookState } from "../chess.js";
import ChessState from "../chess_state.js";
import Piece from "./pieces.js";

export default class Rook extends Piece<PieceMoves> {
  name = "rook" as PieceType;
  moves: string[][] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);
  }

  calculateMoves(): void {
    if (this.moves) return;

    this.moves = [[], [], [], []];

    // Rook can move in the 4 cardinal directions
    // North
    // West
    // South
    // East

    this.calculate(0, -1);
    this.calculate(0, 1);
    this.calculate(1, 0);
    this.calculate(-1, 0);
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;

    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: [],
    };

    for (const moveArr of this.moves!) {
      for (const move of moveArr) {
        const piece = ChessState.boardState[move]!;

        if (!piece.pieceName) {
          this.validMoves.move.push(move);
          continue;
        }

        if (piece.pieceColor === Chess.getOppPieceColor()) {
          this.validMoves.capture.push(move);
          break;
        }

        break;
      }
    }
  }

  pieceCallback(_: string): void {
    const fromState = ChessState.boardState[this.position]!
      .pieceState! as RookState;

    fromState.hasMoved = true;
  }
}
