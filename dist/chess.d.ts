export type PieceImgs = `${PieceType}-${MinifiedPieceColor}`;
type Chess = {
    rankNotation: "abcdefgh";
    fileNotation: "12345678";
    convertNumericPosToAlpha(n: number): string;
    piecesImgs: Record<string, PieceImgs>;
    getImgPath(piece: string): string;
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
export type PieceInfo = {
    img?: string;
    piece?: PieceType;
    pieceColor?: PieceColor;
    pieceState?: PawnState | RookState | KingState | null;
};
//# sourceMappingURL=chess.d.ts.map