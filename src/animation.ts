import ChessState, { CleanupCallback } from "./chess_state.js";
import { assert, match } from "./utils.js";

export type AnimationType = "move";
type ChessAnimationOption = {
  fromPos?: string;
  toPos?: string;
};

export default class ChessAnimation {
  static isAnimating = false;
  finished: Promise<void>;

  ANIMATION_OPTIONS: KeyframeAnimationOptions = {
    duration: 500,
    easing: "ease",
    fill: "forwards",
  };

  constructor(
    animationType: AnimationType,
    options: ChessAnimationOption,
    cleanupCallback: CleanupCallback,
  ) {
    switch (animationType) {
      case "move":
        assert(options.toPos);
        assert(options.fromPos);

        this.finished = this.movePiece(
          options.fromPos!,
          options.toPos!,
          cleanupCallback,
        );
        break;
    }
  }

  async movePiece(
    posFrom: string,
    posTo: string,
    cleanupCallback: CleanupCallback,
  ) {
    ChessAnimation.isAnimating = true;

    const fromState = ChessState.boardState[posFrom]!;
    const toState = ChessState.boardState[posTo]!;
    const fromElem = fromState.element;
    const toElem = toState.element;
    const fromElemBCR = fromElem.getBoundingClientRect();
    const toElemBCR = toElem.getBoundingClientRect();

    await fromElem
      .querySelector("img")!
      .animate(
        match(ChessState.pieceFacingDown, {
          white: () => [
            { translate: "0 0" },
            {
              translate: `${fromElemBCR.right - toElemBCR.right}px ${toElemBCR.bottom - fromElemBCR.bottom}px`,
            },
          ],
          black: () => [
            { translate: "0 0" },
            {
              translate: `${toElemBCR.right - fromElemBCR.right}px ${fromElemBCR.bottom - toElemBCR.bottom}px`,
            },
          ],
        }),
        this.ANIMATION_OPTIONS,
      )
      .finished.then(() => cleanupCallback(fromState, toState));
  }
}
