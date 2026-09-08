import ChessState from "./chess_state.js";
import { assert, match, Trick } from "./utils.js";

export type AnimationType = "move" | "remove";
type ChessAnimationOption = {
  fromPos?: string;
  toPos?: string;
};

export default class ChessAnimation {
  static isAnimating = false;

  finished!: Promise<Animation>;

  ANIMATION_OPTIONS: KeyframeAnimationOptions = {
    duration: 500,
    easing: "ease",
    fill: "forwards",
  };

  constructor(
    animationType: AnimationType | AnimationType[],
    options: ChessAnimationOption | ChessAnimationOption[],
  ) {
    if (ChessAnimation.isAnimating) return this;

    ChessAnimation.isAnimating = true;

    if (Array.isArray(animationType)) {
      assert(Array.isArray(options));

      this.finished = Trick<Promise<Animation>>(
        Promise.allSettled(
          animationType.map((type, index) =>
            this.getAnimation(
              type,
              (options as ChessAnimationOption[])[index]!,
            ),
          ),
        ),
      );
      return this;
    }

    assert(!Array.isArray(options));

    this.finished = this.getAnimation(
      animationType as AnimationType,
      options as ChessAnimationOption,
    );
  }

  movePiece(posFrom: string, posTo: string) {
    const fromState = ChessState.boardState[posFrom]!;
    const toState = ChessState.boardState[posTo]!;
    const fromElem = fromState.element;
    const toElem = toState.element;
    const fromElemBCR = fromElem.getBoundingClientRect();
    const toElemBCR = toElem.getBoundingClientRect();

    return fromElem.querySelector("img")!.animate(
      match(ChessState.pieceFacingDown, {
        white: () => [
          { translate: "0 0" },
          {
            translate: `${toElemBCR.right - fromElemBCR.right}px ${toElemBCR.bottom - fromElemBCR.bottom}px`,
          },
        ],
        black: () => [
          { translate: "0 0" },
          {
            translate: `${fromElemBCR.right - toElemBCR.right}px ${fromElemBCR.bottom - toElemBCR.bottom}px`,
          },
        ],
      }),
      this.ANIMATION_OPTIONS,
    ).finished;
  }

  removePiece(posTo: string) {
    return ChessState.boardState[posTo]!.element.querySelector("img")!.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      this.ANIMATION_OPTIONS,
    ).finished;
  }

  getAnimation(
    animationType: AnimationType,
    options: ChessAnimationOption,
  ): Promise<Animation> {
    return match(animationType, {
      move: () => {
        assert((options as ChessAnimationOption).toPos);
        assert((options as ChessAnimationOption).fromPos);

        return this.movePiece(
          (options as ChessAnimationOption).fromPos!,
          (options as ChessAnimationOption).toPos!,
        );
      },
      remove: () => {
        assert((options as ChessAnimationOption).toPos);

        return this.removePiece((options as ChessAnimationOption).toPos!);
      },
    });
  }
}
