import Board from "./board.js";
import { assert } from "./utils.js";

export type PieceImgs = `${PieceType}-${MinifiedPieceColor}`;

type Chess = {
  rankNotation: "abcdefgh";
  fileNotation: "12345678";
  convertNumericPosToAlpha(n: number): string;
  piecesImgs: Record<string, PieceImgs>;
  getImgPath(piece: string): string;
};

const Chess: Chess = {
  rankNotation: "abcdefgh",
  fileNotation: "12345678",
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
};

export default Chess;

export type PieceColor = "black" | "white";
export type MinifiedPieceColor = "b" | "w";
export type PieceType =
  "pawn" | "queen" | "rook" | "bishop" | "king" | "knight";
export type PawnState = {
  hasMoved: boolean;
};
export type RookState = {
  hasMoved: boolean;
};
export type KingState = {
  hasCastled: boolean;
};

export type PieceInfo = {
  img?: string;
  piece?: PieceType;
  pieceColor?: PieceColor;
  pieceState?: PawnState | RookState | KingState | null;
};

function initChess() {
  const playArea = document.getElementById("playArea");

  if (!(playArea instanceof HTMLDivElement)) return;
  new Board(playArea);
}

initChess();
