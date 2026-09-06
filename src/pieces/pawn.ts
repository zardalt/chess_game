import Chess, { PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import { match } from "../utils.js";
import Piece from "./pieces.js";

export default class Pawn extends Piece {
  name: PieceType = "pawn";

  constructor(signal: AbortSignal, position: string) {
    super(signal, position);
  }

  calculateMoves() {
    if (this.moves) return;

    // Pawn can move two steps forward
    //    If pawn is black, number increases
    //    If pawn is white, number decreases
    this.moves = match(ChessState.turn, {
      white: () => [
        Chess.offsetPosition(this.position, [0, -1]),
        Chess.offsetPosition(this.position, [0, -2]),
      ],
      black: () => [
        Chess.offsetPosition(this.position, [0, 1]),
        Chess.offsetPosition(this.position, [0, 2]),
      ],
    });
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;

    if (!this.moves) this.calculateMoves();

    this.validMoves = [...this.moves!];
  }

  addEventListeners() {
    ChessState.boardState[this.position]?.element.addEventListener(
      "click",
      () => {
        this.calculateValidMoves();
        console.log(this.validMoves);
      },
      {
        signal: this.signal,
      },
    );
  }
}
