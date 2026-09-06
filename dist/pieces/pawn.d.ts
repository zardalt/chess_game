import { PieceType } from "../chess.js";
import Piece from "./pieces.js";
export default class Pawn extends Piece {
    name: PieceType;
    constructor(signal: AbortSignal, position: string);
    calculateMoves(): void;
    calculateValidMoves(): void;
    addEventListeners(): void;
}
//# sourceMappingURL=pawn.d.ts.map