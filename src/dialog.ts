import Chess, { PieceType } from "./chess.js";
import ChessState from "./chess_state.js";

type PromotionPieces = Omit<Omit<PieceType, "pawn">, "king">;
const promotionPieces: PromotionPieces[] = [
  "rook",
  "knight",
  "bishop",
  "queen",
];

export async function getPawnPromotion(): Promise<PromotionPieces> {
  const cntrl = new AbortController();

  Chess.pawnPromotionPopover.addEventListener(
    "beforetoggle",
    (e) => {
      if (e.newState === "closed") {
        ChessState.pawnPromotionPopoverAnchor?.style.removeProperty(
          "anchor-name",
        );
        cntrl.abort();
      }
    },
    { signal: cntrl.signal },
  );

  const result = await new Promise((resolve) => {
    [...Chess.pawnPromotionPopover.children].forEach((child, index) => {
      child.querySelector("img")!.src = Chess.getImgPath(
        promotionPieces[index]! + `-${ChessState.turn[0]}`,
      );

      child.addEventListener(
        "click",
        () => {
          resolve(promotionPieces[index]);
        },
        { signal: cntrl.signal },
      );
    });
  });

  Chess.pawnPromotionPopover.hidePopover();
  return result as PromotionPieces;
}
