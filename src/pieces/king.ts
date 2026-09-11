import Chess, { KingMoves, KingState, PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import Piece from "./pieces.js";

export default class King extends Piece<KingMoves> {
  name: PieceType = "king";
  moves: string[] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);
  }

  calculateMoves(): void {
    if (this.moves) return;

    this.moves = [];

    try {
      this.moves.push(Chess.offsetPosition(this.position, [0, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [0, 1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, 0]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, 0]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [1, 1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, -1]));
    } catch {}

    try {
      this.moves.push(Chess.offsetPosition(this.position, [-1, 1]));
    } catch {}
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;
    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: [],
      castle: [],
    };

    for (const pos of this.moves!) {
      const { pieceName, pieceColor } = ChessState.boardState[pos]!;

      if (!pieceName) {
        this.validMoves.move.push(pos);
      } else if (pieceColor === Chess.getOppPieceColor()) {
        this.validMoves.capture.push(pos);
      }
    }

    // Validate castle

    if (ChessState.boardState[this.position]!.pieceState?.hasMoved) return;

    switch (ChessState.turn) {
      case "black":
        // Queenside
        const queenSideRook = ChessState.boardState["a1"]!;
        if (
          queenSideRook.pieceName === "rook" &&
          !queenSideRook.pieceState?.hasMoved
        ) {
          if (
            !["b1", "c1", "d1"]
              .map((pos) => !!ChessState.boardState[pos]?.pieceName)
              .some((exists) => exists)
          ) {
            this.validMoves.castle.push(["c1", "a1", "d1"]);
          }
        }
        // Kingside
        const kingSideRook = ChessState.boardState["h1"]!;
        if (
          kingSideRook.pieceName === "rook" &&
          !kingSideRook.pieceState?.hasMoved
        ) {
          if (
            !["f1", "g1"]
              .map((pos) => !!ChessState.boardState[pos]?.pieceName)
              .some((exists) => exists)
          ) {
            this.validMoves.castle.push(["g1", "h1", "f1"]);
          }
        }
        break;
      case "white":
        // Queenside
        const queenSideRook2 = ChessState.boardState["a8"]!;
        if (
          queenSideRook2.pieceName === "rook" &&
          !queenSideRook2.pieceState?.hasMoved
        ) {
          if (
            !["b8", "c8", "d8"]
              .map((pos) => !!ChessState.boardState[pos]?.pieceName)
              .some((exists) => exists)
          ) {
            this.validMoves.castle.push(["c8", "a8", "d8"]);
          }
        }
        // Kingside
        const kingSideRook2 = ChessState.boardState["h8"]!;
        if (
          kingSideRook2.pieceName === "rook" &&
          !kingSideRook2.pieceState?.hasMoved
        ) {
          if (
            !["f8", "g8"]
              .map((pos) => !!ChessState.boardState[pos]?.pieceName)
              .some((exists) => exists)
          ) {
            this.validMoves.castle.push(["g8", "h8", "f8"]);
          }
        }
    }
  }

  pieceCallback(_: string): void {
    (ChessState.boardState[this.position]!.pieceState as KingState).hasMoved =
      true;
  }
}
