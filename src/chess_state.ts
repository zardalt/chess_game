import Chess, { PieceInfo, PieceColor, Pieces } from "./chess.js";
import Pawn from "./pieces/pawn.js";
import { assert, match } from "./utils.js";

export default class ChessState {
  static boardState: Record<string, PieceInfo> = {};
  static whitePiecesPos: string[] = [];
  static blackPiecesPos: string[] = [];
  static turn: PieceColor = "white";
  static controller: AbortController = new AbortController();
  static listeners: Pieces[] = [];

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
          const pawn = new Pawn(ChessState.controller.signal, pos);
          pawn.addEventListeners();
          ChessState.listeners.push(pawn);
          break;
      }
    });
  }
}
