import Board from "./board.js";
import { assert } from "./utils.js";
const Chess = {
    rankNotation: "abcdefgh",
    fileNotation: "12345678",
    convertNumericPosToAlpha(n) {
        const rank = this.rankNotation[n % 8];
        const file = this.fileNotation[Math.floor(n / 8)];
        assert(rank);
        assert(file);
        return rank + file;
    },
    piecesImgs: {
        BLACK_ROOK: "rook-b",
        BLACK_KNIGHT: "knight-b",
        BLACK_BISHOP: "bishop-b",
        BLACK_KING: "king-b",
        BLACK_QUEEN: "queen-b",
        BLACK_PAWN: "pawn-b",
        WHITE_ROOK: "rook-w",
        WHITE_PAWN: "pawn-w",
        WHITE_KNIGHT: "knight-w",
        WHITE_BISHOP: "bishop-w",
        WHITE_KING: "king-w",
        WHITE_QUEEN: "queen-w",
    },
    getImgPath(piece) {
        return `../assets/pieces/${piece}.svg`;
    },
    offsetPosition(ltrPos, offsetUnit) {
        assert(ltrPos.length === 2);
        const currLtrInd = [...this.rankNotation].findIndex((ltr) => ltr === ltrPos[0]);
        const currNumInd = [...this.fileNotation].findIndex((num) => num === ltrPos[1]);
        assert(currLtrInd !== undefined);
        assert(currNumInd !== undefined);
        const newLtr = this.rankNotation[currLtrInd + offsetUnit[0]];
        const newNum = this.fileNotation[currNumInd + offsetUnit[1]];
        assert(newLtr !== undefined);
        assert(newNum !== undefined);
        return newLtr + newNum;
    },
};
export default Chess;
function initChess() {
    const playArea = document.getElementById("playArea");
    if (!(playArea instanceof HTMLDivElement))
        return;
    new Board(playArea);
}
initChess();
//# sourceMappingURL=chess.js.map