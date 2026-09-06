import ChessAnimation, { AnimationType } from "./animation.js";
import { PieceInfo, PieceColor } from "./chess.js";
import Pawn from "./pieces/pawn.js";
import { assert, match } from "./utils.js";

export type CleanupCallback = (
  fromState: PieceInfo,
  toState: PieceInfo,
) => void;

export default class ChessState {
  static boardState: Record<string, PieceInfo> = {};
  static whitePiecesPos: string[] = [];
  static blackPiecesPos: string[] = [];
  static turn: PieceColor = "white";
  static pieceController: AbortController = new AbortController();
  static hintController: AbortController = new AbortController();
  static pieceFacingDown: PieceColor = "white";
  static hints: string[] = [];
  static currentHintPos: string | null;

  static addEvents() {
    match(
      ChessState.turn,
      {
        white: () => ChessState.whitePiecesPos,
        black: () => ChessState.blackPiecesPos,
      },
      [] as string[],
    ).forEach((pos) => {
      const piece = ChessState.boardState[pos]!;
      assert(piece?.pieceName);

      piece.element.disabled = false;

      switch (piece.pieceName!) {
        case "pawn":
          const pawn = new Pawn(pos, ChessState.pieceController.signal);
          ChessState.boardState[pos]!.piece = pawn;
          pawn.addEventListeners();
          break;
      }
    });
  }
  static showHints(pos: string) {
    ChessState.hideHints();
    ChessState.currentHintPos = pos;
    ChessState.hintController = new AbortController();

    const piece = ChessState.boardState[pos]!.piece!;
    assert(piece?.validMoves);

    piece.validMoves!.move.forEach((toPos) => {
      const element = ChessState.boardState[toPos]!.element;

      element.disabled = false;
      element.addEventListener(
        "click",
        () => {
          ChessState.movePiece(pos, toPos);
        },
        { signal: ChessState.hintController.signal },
      );
      element.classList.add("hint", "move");

      ChessState.hints.push(toPos);
    });
  }

  static hideHints() {
    if (ChessState.hints.length === 0) return;

    ChessState.hintController.abort();
    ChessState.currentHintPos = null;

    ChessState.hints.forEach((hintPos) => {
      const element = ChessState.boardState[hintPos]!.element;

      element.disabled = true;
      element.classList.remove("hint", "move");
    });
  }

  static async movePiece(from: string, to: string) {
    if (ChessAnimation.isAnimating) return;

    ChessState.hideHints();

    const cleanupFunction: CleanupCallback = (fromState, toState) => {
      const fromImg = fromState.element.querySelector("img")!;
      const toImg = toState.element.querySelector("img")!;
      assert(fromImg);
      assert(toImg);

      fromImg.style.translate = "0 0";
      toImg.style.translate = "0 0";
      ChessState.switchImages(fromImg, toImg);
      fromState.piece!.pieceCallback(to);
      ChessState.updateState("move", fromState, toState);

      ChessAnimation.isAnimating = false;
      console.log(ChessState.boardState);
    };

    await new ChessAnimation(
      "move",
      {
        fromPos: from,
        toPos: to,
      },
      cleanupFunction,
    ).finished;
  }

  static switchImages(fromImg: HTMLImageElement, toImg: HTMLImageElement) {
    const holdImgSrc = fromImg.src;
    fromImg.src = toImg.src;
    toImg.src = holdImgSrc;
  }

  static updateState(
    operationType: AnimationType,
    fromState: PieceInfo,
    toState: PieceInfo,
  ) {
    switch (operationType) {
      case "move":
        toState.pieceName = fromState.pieceName;
        toState.pieceColor = fromState.pieceColor;
        toState.img = fromState.img;
        toState.pieceState = fromState.pieceState;

        delete fromState.pieceName;
        delete fromState.pieceColor;
        delete fromState.img;
        delete fromState.piece;
        delete fromState.pieceState;
    }
  }
}
