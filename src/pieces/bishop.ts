import Piece from "./pieces.js";
import Chess, { PieceMoves, PieceType } from "../chess.js";
import ChessState from "../chess_state.js";

export default class Bishop extends Piece<PieceMoves> {
  name: PieceType = "bishop";
  moves: string[][] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);
  }

  calculateMoves(): void {
    // Bishop moves diagonally in four directions
    // These are his movement formulas:
    // Number increases, letter increases
    // Number decreases, letter increases
    // Number increases, letter decreases
    // Number decreases, letter decreases

    if (this.moves) return;

    this.moves = [[], [], [], []];

    this.calculate(1, 1);
    this.calculate(1, -1);
    this.calculate(-1, 1);
    this.calculate(-1, -1);
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;

    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: [],
    };

    for (const moves of this.moves!) {
      for (const movePos of moves) {
        const pieceInfo = ChessState.boardState[movePos]!;

        if (!pieceInfo.pieceName) {
          this.validMoves.move.push(movePos);
          continue;
        }

        pieceInfo.pieceColor === Chess.getOppPieceColor() &&
          this.validMoves.capture.push(movePos);

        break;
      }
    }
  }

  pieceCallback(_: string): void {}
}
