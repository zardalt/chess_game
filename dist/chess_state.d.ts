import { PieceInfo, PieceColor } from "./chess";
export default class ChessState {
    protected boardState: Record<string, PieceInfo>;
    protected whitePiecesPos: string[];
    protected blackPiecesPos: string[];
    protected turn: PieceColor;
}
//# sourceMappingURL=chess_state.d.ts.map