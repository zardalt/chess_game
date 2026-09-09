import Board from "./board.js";
import ChessState from "./chess_state.js";
import Knight from "./pieces/knight.js";
import Pawn from "./pieces/pawn.js";
import Rook from "./pieces/rook.js";
import { assert } from "./utils.js";

export type PieceImgs = `${PieceType}-${MinifiedPieceColor}`;

type Chess = {
  rankNotation: "abcdefgh";
  fileNotation: "12345678";
  pawnPromotionPopover: HTMLDivElement;
  convertNumericPosToAlpha(n: number): string;
  piecesImgs: Record<string, PieceImgs>;
  getImgPath(piece: string): string;
  offsetPosition(ltrPos: string, offsetUnit: [number, number]): string;
  getOppPieceColor(): PieceColor;
};

const Chess: Chess = {
  rankNotation: "abcdefgh",
  fileNotation: "12345678",
  pawnPromotionPopover: document.getElementById(
    "pawnPromotion",
  ) as HTMLDivElement,
  convertNumericPosToAlpha(n) {
    const rank = this.rankNotation[n % 8]!;
    const file = this.fileNotation[Math.floor(n / 8)];

    assert(rank);
    assert(file);

    return rank + file;
  },
  piecesImgs: {
    BLACK_ROOK: "rook-b",
    BLACK_KNIGHT: "knight-b",
    BLACK_BISHOP: "bishop-b",
    BLACK_KING: "king-b",
    BLACK_QUEEN: "queen-b",
    BLACK_PAWN: "pawn-b",
    WHITE_ROOK: "rook-w",
    WHITE_PAWN: "pawn-w",
    WHITE_KNIGHT: "knight-w",
    WHITE_BISHOP: "bishop-w",
    WHITE_KING: "king-w",
    WHITE_QUEEN: "queen-w",
  },
  getImgPath(piece) {
    return `../assets/pieces/${piece}.svg`;
  },
  offsetPosition(ltrPos, offsetUnit): string {
    assert(ltrPos.length === 2);

    const currLtrInd = [...this.rankNotation].findIndex(
      (ltr) => ltr === ltrPos[0],
    );
    const currNumInd = [...this.fileNotation].findIndex(
      (num) => num === ltrPos[1],
    );

    assert(currLtrInd !== undefined);
    assert(currNumInd !== undefined);

    const newLtr = this.rankNotation[currLtrInd + offsetUnit[0]]!;
    const newNum = this.fileNotation[currNumInd + offsetUnit[1]];

    assert(newLtr !== undefined);
    assert(newNum !== undefined);

    return newLtr + newNum;
  },
  getOppPieceColor() {
    return ChessState.turn === "white" ? "black" : "white";
  },
};

export default Chess;

export type PieceColor = "black" | "white";
export type MinifiedPieceColor = "b" | "w";
export type PieceType =
  "pawn" | "queen" | "rook" | "bishop" | "king" | "knight";
export type PawnState = {
  hasMoved?: boolean;
  enPassantLiable?: boolean;
};
export type RookState = {
  hasMoved: boolean;
};
export type KingState = {
  hasCastled: boolean;
};

export type Pieces = Pawn | Rook | Knight;
export type PieceState = PawnState | RookState | KingState;

export type PieceMoves = {
  move: string[];
  capture: string[];
};
export type PawnMoves = {
  move: string[];
  capture: {
    capture: string[];
    enPassant?: [string, string];
  };
  promote: {
    move?: string;
    capture: string[];
  };
};
export type KingMoves = PieceMoves & {
  castle: string[];
};

export type PieceInfo = {
  img?: string;
  pieceName?: PieceType;
  pieceColor?: PieceColor;
  pieceState?: PieceState | null;
  piece?: Pieces | undefined;
  element: HTMLButtonElement;
};

function initChess() {
  const playArea = document.getElementById("playArea");

  if (!(playArea instanceof HTMLDivElement)) return;
  new Board(playArea);
}

initChess();
