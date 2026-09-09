import ChessAnimation from "../animation.js";
import { PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import { assert } from "../utils.js";

export default abstract class Piece<T> {
  abstract name: PieceType;
  abstract calculateMoves(): void;
  abstract calculateValidMoves(): void;
  abstract pieceCallback(to: string): void;

  signal;
  position;
  validMoves: T | null = null;

  constructor(position: string, signal?: AbortSignal) {
    this.signal = signal;
    this.position = position;
  }

  addEventListeners() {
    assert(this.signal);

    ChessState.boardState[this.position]?.element.addEventListener(
      "click",
      () => {
        if (ChessAnimation.isAnimating) return;
        this.calculateValidMoves();

        if (ChessState.currentHintPos === this.position) ChessState.hideHints();
        else ChessState.showHints(this.position);
      },
      {
        signal: this.signal!,
      },
    );
  }
}
