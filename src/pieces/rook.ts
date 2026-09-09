import Chess, { PieceMoves, PieceType, RookState } from "../chess.js";
import ChessState from "../chess_state.js";
import { match } from "../utils.js";
import Piece from "./pieces.js";

export default class Rook extends Piece<PieceMoves> {
  name = "rook" as PieceType;
  moves: string[][] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);
  }

  calculateMoves(): void {
    if (this.moves) return;

    this.moves = [];

    // Rook can move in the 4 cardinal directions
    // North
    // West
    // South
    // East

    // North:
    //  white - same letter, reducing number
    //  black - same letter, increasing number

    this.moves.push([]);
    try {
      for (let i = 1; true; i++) {
        this.moves[0]!.push(
          match(ChessState.turn, {
            white: () => Chess.offsetPosition(this.position, [0, -i]),
            black: () => Chess.offsetPosition(this.position, [0, i]),
          }),
        );
      }
    } catch {}

    // East:
    //  white - increasing letter, same number
    //  black - decreasing letter, same number

    this.moves.push([]);
    try {
      for (let i = 1; true; i++) {
        this.moves[1]!.push(
          match(ChessState.turn, {
            white: () => Chess.offsetPosition(this.position, [i, 0]),
            black: () => Chess.offsetPosition(this.position, [-i, 0]),
          }),
        );
      }
    } catch {}

    // South:
    //  white - same letter, increasing number
    //  black - same letter, decreasing number

    this.moves.push([]);
    try {
      for (let i = 1; true; i++) {
        this.moves[2]!.push(
          match(ChessState.turn, {
            white: () => Chess.offsetPosition(this.position, [0, i]),
            black: () => Chess.offsetPosition(this.position, [0, -i]),
          }),
        );
      }
    } catch {}

    // West
    //  white - decreasing letter, same number
    //  black - increasing letter, same number

    this.moves.push([]);
    try {
      for (let i = 1; true; i++) {
        this.moves[3]!.push(
          match(ChessState.turn, {
            white: () => Chess.offsetPosition(this.position, [-i, 0]),
            black: () => Chess.offsetPosition(this.position, [i, 0]),
          }),
        );
      }
    } catch {}
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
