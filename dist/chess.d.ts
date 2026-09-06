import Pawn from "./pieces/pawn.js";
export type PieceImgs = `${PieceType}-${MinifiedPieceColor}`;
type Chess = {
    rankNotation: "abcdefgh";
    fileNotation: "12345678";
    convertNumericPosToAlpha(n: number): string;
    piecesImgs: Record<string, PieceImgs>;
    getImgPath(piece: string): string;
    offsetPosition(ltrPos: string, offsetUnit: [number, number]): string;
};
declare const Chess: Chess;
export default Chess;
export type PieceColor = "black" | "white";
export type MinifiedPieceColor = "b" | "w";
export type PieceType = "pawn" | "queen" | "rook" | "bishop" | "king" | "knight";
export type PawnState = {
    hasMoved: boolean;
};
export type RookState = {
    hasMoved: boolean;
};
export type KingState = {
    hasCastled: boolean;
};
export type Pieces = Pawn;
export type PieceState = PawnState | RookState | KingState;
export type PieceInfo = {
    img?: string;
    pieceName?: PieceType;
    pieceColor?: PieceColor;
    pieceState?: PieceState | null;
    piece?: Pieces | undefined;
    element: HTMLButtonElement;
};
//# sourceMappingURL=chess.d.ts.map