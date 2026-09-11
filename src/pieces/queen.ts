import Chess, { PieceMoves, PieceType } from "../chess.js";
import Piece from "./pieces.js";
import Rook from "./rook.js";
import Bishop from "./bishop.js";
import ChessState from "../chess_state.js";

export default class Queen extends Piece<PieceMoves> {
  name: PieceType = "queen";
  moves: string[][] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);
  }

  calculateMoves(): void {
    if (this.moves) return;

    const rook = new Rook(this.position);
    rook.calculateMoves();

    const bishop = new Bishop(this.position);
    bishop.calculateMoves();

    this.moves = [...rook.moves!, ...bishop.moves!];
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;
    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: []
    };

    for (const movesPosArr of this.moves!) {
      for (const pos of movesPosArr) {
        const { pieceName, pieceColor } = ChessState.boardState[pos]!;

        if (!pieceName) {
          this.validMoves.move.push(pos);
          continue;
        }

        pieceColor === Chess.getOppPieceColor() 
          && this.validMoves.capture.push(pos);

        break;
      }
    }
  }

  pieceCallback(_: string) {}
}
