import { PieceImgs } from "./chess.js";
export default class Board {
    board: HTMLDivElement;
    colorOne: string;
    colorTwo: string;
    defaultBoardSetup: Record<number, PieceImgs>;
    constructor(element: HTMLDivElement);
    setupBoard(): void;
    placePieces(): void;
}
//# sourceMappingURL=board.d.ts.map