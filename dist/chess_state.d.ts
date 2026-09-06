import { PieceInfo, PieceColor, Pieces } from "./chess.js";
export default class ChessState {
    static boardState: Record<string, PieceInfo>;
    static whitePiecesPos: string[];
    static blackPiecesPos: string[];
    static turn: PieceColor;
    static controller: AbortController;
    static listeners: Pieces[];
    static addEvents(): void;
}
//# sourceMappingURL=chess_state.d.ts.map