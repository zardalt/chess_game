import Pawn from "./pieces/pawn.js";
import { assert, match } from "./utils.js";
export default class ChessState {
    static boardState = {};
    static whitePiecesPos = [];
    static blackPiecesPos = [];
    static turn = "white";
    static controller = new AbortController();
    static listeners = [];
    static addEvents() {
        match(ChessState.turn, {
            white: () => ChessState.whitePiecesPos,
            black: () => ChessState.blackPiecesPos,
        }, []).forEach((pos) => {
            const piece = ChessState.boardState[pos];
            assert(piece?.pieceName);
            piece.element.disabled = false;
            switch (piece.pieceName) {
                case "pawn":
                    const pawn = new Pawn(ChessState.controller.signal, pos);
                    pawn.addEventListeners();
                    ChessState.listeners.push(pawn);
                    break;
            }
        });
    }
}
//# sourceMappingURL=chess_state.js.map