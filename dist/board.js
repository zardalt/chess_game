import Chess from "./chess.js";
import { isMultipleOf } from "./utils.js";
export default class Board {
    board;
    colorOne = "#ffffff";
    colorTwo = "teal";
    defaultBoardSetup = {
        0: Chess.piecesImgs.BLACK_ROOK,
        7: Chess.piecesImgs.BLACK_ROOK,
        1: Chess.piecesImgs.BLACK_KNIGHT,
        6: Chess.piecesImgs.BLACK_KNIGHT,
        2: Chess.piecesImgs.BLACK_BISHOP,
        5: Chess.piecesImgs.BLACK_BISHOP,
        3: Chess.piecesImgs.BLACK_QUEEN,
        4: Chess.piecesImgs.BLACK_KING,
        8: Chess.piecesImgs.BLACK_PAWN,
        9: Chess.piecesImgs.BLACK_PAWN,
        10: Chess.piecesImgs.BLACK_PAWN,
        11: Chess.piecesImgs.BLACK_PAWN,
        12: Chess.piecesImgs.BLACK_PAWN,
        13: Chess.piecesImgs.BLACK_PAWN,
        14: Chess.piecesImgs.BLACK_PAWN,
        15: Chess.piecesImgs.BLACK_PAWN,
        56: Chess.piecesImgs.WHITE_ROOK,
        63: Chess.piecesImgs.WHITE_ROOK,
        57: Chess.piecesImgs.WHITE_KNIGHT,
        62: Chess.piecesImgs.WHITE_KNIGHT,
        58: Chess.piecesImgs.WHITE_BISHOP,
        61: Chess.piecesImgs.WHITE_BISHOP,
        59: Chess.piecesImgs.WHITE_QUEEN,
        60: Chess.piecesImgs.WHITE_KING,
        48: Chess.piecesImgs.WHITE_PAWN,
        49: Chess.piecesImgs.WHITE_PAWN,
        50: Chess.piecesImgs.WHITE_PAWN,
        51: Chess.piecesImgs.WHITE_PAWN,
        52: Chess.piecesImgs.WHITE_PAWN,
        53: Chess.piecesImgs.WHITE_PAWN,
        54: Chess.piecesImgs.WHITE_PAWN,
        55: Chess.piecesImgs.WHITE_PAWN,
    };
    constructor(element) {
        this.board = element;
        this.setupBoard();
    }
    setupBoard() {
        for (let i = 0; i < 8; i++) {
            let cellColor = isMultipleOf(i, 2) ? this.colorOne : this.colorTwo;
            for (let j = 0; j < 8; j++) {
                const loopIndex = i * 8 + j;
                const cell = document.createElement("button");
                cell.style.backgroundColor = cellColor;
                cell.id = Chess.convertNumericPosToAlpha(loopIndex);
                const cellPiece = document.createElement("img");
                const cellPieceImg = this.defaultBoardSetup[loopIndex];
                cellPiece.src = cellPieceImg ? cellPieceImg : "";
                cell.disabled = true;
                cell.appendChild(cellPiece);
                this.board.appendChild(cell);
                cellColor = cellColor === this.colorOne ? this.colorTwo : this.colorOne;
            }
        }
    }
}
//# sourceMappingURL=board.js.map