import ChessAnimation, { AnimationType } from "./animation.js";
import Chess, { PieceInfo, PieceColor, PieceType } from "./chess.js";
import { getPawnPromotion } from "./dialog.js";
import Bishop from "./pieces/bishop.js";
import King from "./pieces/king.js";
import Knight from "./pieces/knight.js";
import Pawn from "./pieces/pawn.js";
import Queen from "./pieces/queen.js";
import Rook from "./pieces/rook.js";
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
  static currentPromotionPopover: HTMLButtonElement[] = [];
  static pawnPromotionPopoverAnchor: HTMLButtonElement | null = null;

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
        case "rook":
          const rook = new Rook(pos, this.pieceController.signal);
          this.boardState[pos]!.piece = rook;
          rook.addEventListeners();
          break;
        case "knight":
          const knight = new Knight(pos, this.pieceController.signal);
          this.boardState[pos]!.piece = knight;
          knight.addEventListeners();
          break;
        case "bishop":
          const bishop = new Bishop(pos, this.pieceController.signal);
          this.boardState[pos]!.piece = bishop;
          bishop.addEventListeners();
          break;
        case "queen":
          const queen = new Queen(pos, this.pieceController.signal);
          this.boardState[pos]!.piece = queen;
          queen.addEventListeners();
          break;
        case "king":
          const king = new King(pos, this.pieceController.signal);
          this.boardState[pos]!.piece = king;
          king.addEventListeners();
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

    // =================================
    // MOVE
    // =================================

    piece.validMoves!.move.forEach((toPos) => {
      const element = this.boardState[toPos]!.element;

      element.disabled = false;
      element.addEventListener(
        "click",
        async () => {
          await this.movePiece(pos, toPos);
          this.postOperation();
        },
        { signal: this.hintController.signal },
      );
      element.classList.add("hint", "move");

      this.hints.push(toPos);
    });

    const initPopover = (element: HTMLButtonElement) => {
      element.popoverTargetElement = Chess.pawnPromotionPopover;
      element.popoverTargetAction = "toggle";

      this.currentPromotionPopover.push(element);

      if (this.pieceFacingDown === this.turn) {
        Chess.pawnPromotionPopover.style.top = "anchor(top)";
        Chess.pawnPromotionPopover.style.bottom = "unset";
        Chess.pawnPromotionPopover.style.setProperty(
          "--pawn-promotion-translate-direction",
          "-100%",
        );
        Chess.pawnPromotionPopover.style.flexDirection = "column";
      } else {
        Chess.pawnPromotionPopover.style.top = "unset";
        Chess.pawnPromotionPopover.style.bottom = "anchor(bottom)";
        Chess.pawnPromotionPopover.style.setProperty(
          "--pawn-promotion-translate-direction",
          "100%",
        );
        Chess.pawnPromotionPopover.style.flexDirection = "column-reverse";
      }
    };

    // Pawn promotion
    const promotionMovePos = (piece as Pawn).validMoves!.promote?.move;
    if (promotionMovePos) {
      const element = this.boardState[promotionMovePos]!.element;

      element.disabled = false;
      element.addEventListener(
        "click",
        async () => {
          this.pawnPromotionPopoverAnchor?.style.removeProperty("anchor-name");
          element.style.setProperty("anchor-name", "--promoteCell");
          this.pawnPromotionPopoverAnchor = element;

          await this.promotePawn("move", pos, promotionMovePos);
          this.postOperation();
        },
        { signal: this.hintController.signal },
      );
      element.classList.add("hint", "promote");
      initPopover(element);
      this.hints.push(promotionMovePos);
    }

    // =================================
    // CAPTURE
    // =================================

    // Default capture
    // If it's a pawn, return capture.capture else just return capture
    match(
      piece.name,
      {
        pawn: () => (piece as Pawn).validMoves!.capture.capture,
      },
      Trick<string[]>(piece.validMoves!.capture),
    ).forEach((toPos) => {
      const element = this.boardState[toPos]!.element;

      element.disabled = false;
      element.addEventListener(
        "click",
        async () => {
          await this.capturePiece(pos, {
            toPos,
          });
          this.postOperation();
        },
        { signal: this.hintController.signal },
      );
      element.classList.add("hint", "capture");

      this.hints.push(toPos);
    });

    if (piece.name === "pawn") {
      // EnPassant capture
      const enPassantPos = (piece as Pawn).validMoves!.capture.enPassant;
      if (enPassantPos) {
        const element = this.boardState[enPassantPos[0]]!.element;
        assert(element);

        element.disabled = false;
        element.addEventListener(
          "click",
          async () => {
            await this.capturePiece(pos, {
              toPos: enPassantPos[0],
              targetPos: enPassantPos[1],
            });
            this.postOperation();
          },
          { signal: this.hintController.signal },
        );
        element.classList.add("hint", "capture");

        this.hints.push(enPassantPos[0]);
      }

      // Promote by capture
      (piece as Pawn).validMoves!.promote.capture.forEach((move) => {
        const element = this.boardState[move]!.element;
        element.disabled = false;
        element.classList.add("hint", "promote");
        element.addEventListener(
          "click",
          async () => {
            this.pawnPromotionPopoverAnchor?.style.removeProperty(
              "anchor-name",
            );
            element.style.setProperty("anchor-name", "--promoteCell");
            this.pawnPromotionPopoverAnchor = element;

            await this.promotePawn("capture", pos, move);
            this.postOperation();
          },
          { signal: this.hintController.signal },
        );

        initPopover(element);
        this.hints.push(move);
      });
    }
  }

  static hideHints() {
    this.currentHintPos = null;

    if (this.hints.length === 0) return;

    this.hintController.abort();

    this.currentPromotionPopover.forEach((elem) => {
      elem.popoverTargetElement = null;
      elem.popoverTargetAction = "";
    });
    this.currentPromotionPopover = [];

    this.hints.forEach((hintPos) => {
      const element = this.boardState[hintPos]!.element;

      element.disabled = true;
      element.classList.remove("hint", "move", "capture", "promote");
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
  }

  static async capturePiece(from: string, captureOptions: CaptureOptions) {
    this.hideHints();

    const fromState = ChessState.boardState[from]!;
    const toState = ChessState.boardState[captureOptions.toPos]!;

    const postMove = () => {
      fromState.element.disabled = true;
      this.postMove(fromState, toState);
      fromState.piece!.pieceCallback(captureOptions.toPos);
      this.updateState("move", fromState, toState);
    };

    if (
      captureOptions.targetPos &&
      captureOptions.toPos !== captureOptions.targetPos
    ) {
      await new ChessAnimation(
        ["move", "remove"],
        [
          {
            fromPos: from,
            toPos: captureOptions.toPos,
          },
          { toPos: captureOptions.targetPos },
        ],
      ).finished;

      const targetState = this.boardState[captureOptions.targetPos]!;

      postMove();
      this.updateState("remove", targetState);

      let startInd = this.turn === "black" ? 1 : 0;
      const piecePositions = [this.whitePiecesPos, this.blackPiecesPos];

      piecePositions[startInd++ % 2]!.add(captureOptions.toPos).delete(from);
      piecePositions[startInd % 2]!.delete(captureOptions.targetPos);
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

      postMove();

      let startInd = this.turn === "black" ? 1 : 0;
      const piecePositions = [this.whitePiecesPos, this.blackPiecesPos];

      piecePositions[startInd++ % 2]!.add(captureOptions.toPos).delete(from);
      piecePositions[startInd % 2]!.delete(captureOptions.toPos);
    }
  }

  static async promotePawn(
    operationType: "move" | "capture",
    fromPos: string,
    toPos: string,
  ) {
    const promoteTo = await getPawnPromotion();

    switch (operationType) {
      case "move":
        await this.movePiece(fromPos, toPos);
        break;
      case "capture":
        await this.capturePiece(fromPos, {
          toPos,
        });
    }

    const pieceInfo = this.boardState[toPos]!;

    const newImg = Chess.getImgPath(promoteTo + `-${this.turn[0]}`);

    pieceInfo.element.querySelector("img")!.src = newImg;
    pieceInfo.img = newImg;

    pieceInfo.pieceName = promoteTo as PieceType;
    if (promoteTo === "rook") {
      pieceInfo.pieceState = {
        hasMoved: true,
      };
    } else {
      delete pieceInfo.pieceState;
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

  static postOperation() {
    this.switchTurn();
    ChessAnimation.isAnimating = false;
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
        assert(fromState);
        delete fromState!.piece;
        delete fromState!.pieceName;
        delete fromState!.pieceColor;
        delete fromState!.pieceState;
        delete fromState!.img;
        break;
    }
  }

  static switchTurn() {
    this.removeEvents();
    this.turn = this.turn === "white" ? "black" : "white";
    this.addEvents();
  }
}
