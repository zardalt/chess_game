import { PieceType } from "../chess.js";
export default abstract class Piece {
    abstract name: PieceType;
    abstract calculateMoves(): void;
    abstract calculateValidMoves(): void;
    abstract addEventListeners(): void;
    signal: AbortSignal;
    position: string;
    moves: string[] | null;
    validMoves: string[] | null;
    constructor(signal: AbortSignal, position: string);
}
//# sourceMappingURL=pieces.d.ts.map