import ChessAnimation from "../animation.js";
import Chess, { PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import { assert } from "../utils.js";

type OffsetNumbers = -1 | 0 | 1;

export default abstract class Piece<T> {
  abstract name: PieceType;
  abstract calculateMoves(): void;
  abstract calculateValidMoves(): void;
  abstract pieceCallback(to: string): void;

  signal;
  position;
  validMoves: T | null = null;
  calculateIndex = 0;
  moves: any = null;

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

  calculate(num1: OffsetNumbers, num2: OffsetNumbers) {
    assert(this.moves instanceof Array);
    assert(this.moves[this.calculateIndex] instanceof Array);

    try {
      for (let i = 1; true; i++) {
        this.moves![this.calculateIndex]!.push(
          Chess.offsetPosition(this.position, [num1 * i, num2 * i]),
        );
      }
    } catch {
      this.calculateIndex++;
    }
  }
}
