import { PieceImgs } from "./chess.js";
import ChessState from "./chess_state.js";
export default class Board extends ChessState {
    board: HTMLDivElement;
    colorOne: string;
    colorTwo: string;
    defaultBoardSetup: Record<number, PieceImgs>;
    constructor(element: HTMLDivElement);
    setupBoard(): void;
    placePieces(): void;
}
//# sourceMappingURL=board.d.ts.map