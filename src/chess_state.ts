import ChessAnimation, { AnimationType } from "./animation.js";
import { PieceInfo, PieceColor } from "./chess.js";
import Pawn from "./pieces/pawn.js";
import { assert, match, Trick, emptyImage } from "./utils.js";

type CaptureOptions = {
  toPos: string;
  targetPos?: string;
};

export default class ChessState {
  static boardState: Record<string, PieceInfo> = {};
  static whitePiecesPos: Set<string> = new Set();
  static blackPiecesPos: Set<string> = new Set();
  static turn: PieceColor = "white";
  static pieceController: AbortController;
  static hintController: AbortController;
  static pieceFacingDown: PieceColor = "white";
  static hints: string[] = [];
  static currentHintPos: string | null;

  static addEvents() {
    this.pieceController = new AbortController();
    match(this.turn, {
      white: () => this.whitePiecesPos,
      black: () => this.blackPiecesPos,
    }).forEach((pos) => {
      const piece = this.boardState[pos]!;
      assert(piece?.pieceName);

      piece.element.disabled = false;

      switch (piece.pieceName!) {
        case "pawn":
          const pawn = new Pawn(pos, this.pieceController.signal);
          this.boardState[pos]!.piece = pawn;
          pawn.addEventListeners();
          break;
      }
    });
  }

  static removeEvents() {
    match(this.turn, {
      white: () => this.whitePiecesPos,
      black: () => this.blackPiecesPos,
    }).forEach((pos) => {
      const piece = this.boardState[pos]!;

      piece.element.disabled = true;
    });
    this.pieceController.abort();
  }

  static showHints(pos: string) {
    if (ChessAnimation.isAnimating) return;

    this.hideHints();
    this.currentHintPos = pos;
    this.hintController = new AbortController();

    const piece = this.boardState[pos]!.piece!;
    assert(piece?.validMoves);

    piece.validMoves!.move.forEach((toPos) => {
      const element = this.boardState[toPos]!.element;

      element.disabled = false;
      element.addEventListener(
        "click",
        () => {
          this.movePiece(pos, toPos);
        },
        { signal: this.hintController.signal },
      );
      element.classList.add("hint", "move");

      this.hints.push(toPos);
    });

    // =================================
    // CAPTURE
    // =================================

    // Default capture
    match(
      piece.name,
      {
        pawn: () => piece.validMoves!.capture.capture,
      },
      Trick<string[]>(piece.validMoves!.capture),
    ).forEach((toPos) => {
      const element = this.boardState[toPos]!.element;

      element.disabled = false;
      element.addEventListener(
        "click",
        () => {
          this.capturePiece(pos, {
            toPos,
          });
        },
        { signal: this.hintController.signal },
      );
      element.classList.add("hint", "capture");

      this.hints.push(toPos);
    });
  }

  static hideHints() {
    if (this.hints.length === 0) return;

    this.hintController.abort();
    this.currentHintPos = null;

    this.hints.forEach((hintPos) => {
      const element = this.boardState[hintPos]!.element;

      element.disabled = true;
      element.classList.remove("hint", "move", "capture");
    });
    this.hints = [];
  }

  static async movePiece(from: string, to: string) {
    this.hideHints();

    await new ChessAnimation("move", {
      fromPos: from,
      toPos: to,
    }).finished;

    const fromState = ChessState.boardState[from]!;
    const toState = ChessState.boardState[to]!;

    fromState.element.disabled = true;
    this.postMove(fromState, toState);
    fromState.piece!.pieceCallback(to);
    this.updateState("move", fromState, toState);

    match(this.turn, {
      white: () => this.whitePiecesPos,
      black: () => this.blackPiecesPos,
    })
      .add(to)
      .delete(from);

    this.switchTurn();
    ChessAnimation.isAnimating = false;
  }

  static async capturePiece(from: string, captureOptions: CaptureOptions) {
    this.hideHints();

    if (
      captureOptions.targetPos &&
      captureOptions.toPos === captureOptions.targetPos
    ) {
    } else {
      // Default capture
      await new ChessAnimation(
        ["move", "remove"],
        [
          {
            fromPos: from,
            toPos: captureOptions.toPos,
          },
          { toPos: captureOptions.toPos },
        ],
      ).finished;

      const fromState = ChessState.boardState[from]!;
      const toState = ChessState.boardState[captureOptions.toPos]!;

      fromState.element.disabled = true;
      this.postMove(fromState, toState);
      fromState.piece!.pieceCallback(captureOptions.toPos);
      this.updateState("move", fromState, toState);

      let startInd = this.turn === "black" ? 1 : 0;
      const piecePositions = [this.whitePiecesPos, this.blackPiecesPos];

      piecePositions[startInd++ % 2]!.add(captureOptions.toPos).delete(from);
      piecePositions[startInd % 2]!.delete(captureOptions.toPos);

      this.switchTurn();
      ChessAnimation.isAnimating = false;
    }
  }

  static postMove(fromInfo: PieceInfo, toInfo: PieceInfo) {
    const fromImg = fromInfo.element.querySelector("img")!;
    const toImg = toInfo.element.querySelector("img")!;

    assert(fromImg);
    assert(toImg);

    fromImg.style.translate = "0 0";
    toImg.style.translate = "0 0";

    toImg.remove();
    toInfo.element!.appendChild(fromImg.cloneNode());
    fromImg.remove();
    fromInfo.element!.appendChild(emptyImage.cloneNode());
  }

  static updateState(
    operationType: AnimationType,
    fromState?: PieceInfo,
    toState?: PieceInfo,
  ) {
    switch (operationType) {
      case "move":
        assert(fromState);
        assert(toState);

        toState!.pieceName = fromState!.pieceName;
        toState!.pieceColor = fromState!.pieceColor;
        toState!.img = fromState!.img;
        toState!.pieceState = fromState!.pieceState;

        delete fromState!.pieceName;
        delete fromState!.pieceColor;
        delete fromState!.img;
        delete fromState!.piece;
        delete fromState!.pieceState;
        break;
      case "remove":
        assert(toState);
        delete toState!.piece;
        delete toState!.pieceName;
        delete toState!.pieceColor;
        delete toState!.pieceState;
        delete toState!.img;
        break;
    }
  }

  static switchTurn() {
    this.removeEvents();
    this.turn = this.turn === "white" ? "black" : "white";
    this.addEvents();
  }
}
