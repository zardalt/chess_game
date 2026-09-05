import Board from "./board.js";
import { assert } from "./utils.js";

const Chess = {
  rankNotation: "abcdefgh",
  fileNotation: "12345678",
  convertNumericPosToAlpha(n: number): string {
    const rank = this.rankNotation[n % 8]!;
    const file = this.fileNotation[Math.floor(n / 8)];

    console.debug(rank, file, n);

    assert(rank);
    assert(file);

    return rank + file;
  },
  piecesImgs: {
    BLACK_ROOK: "../assets/pieces/rook-b.svg",
    BLACK_KNIGHT: "../assets/pieces/knight-b.svg",
    BLACK_BISHOP: "../assets/pieces/bishop-b.svg",
    BLACK_KING: "../assets/pieces/king-b.svg",
    BLACK_QUEEN: "../assets/pieces/queen-b.svg",
    BLACK_PAWN: "../assets/pieces/pawn-b.svg",
    WHITE_ROOK: "../assets/pieces/rook-w.svg",
    WHITE_PAWN: "../assets/pieces/pawn-w.svg",
    WHITE_KNIGHT: "../assets/pieces/knight-w.svg",
    WHITE_BISHOP: "../assets/pieces/bishop-w.svg",
    WHITE_KING: "../assets/pieces/king-w.svg",
    WHITE_QUEEN: "../assets/pieces/queen-w.svg",
  },
};

export default Chess;

function initChess() {
  const playArea = document.getElementById("playArea");

  if (!(playArea instanceof HTMLDivElement)) return;
  new Board(playArea);
}

initChess();
