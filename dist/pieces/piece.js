var Pieces;
(function (Pieces) {
    class Piece {
        hasBeenInitialized = {
            position: false,
            calculateMoves: false,
            calculateValidMoves: false,
        };
        validateAbstractObjectImpl;
        constructor() {
            this.validateAbstractObjectImpl = (field) => {
                if (!this.hasBeenInitialized[field]) {
                    throw new Error(`The field ${field} of abstract class 'Piece' was used without initialization`);
                }
                if (typeof field !== "function")
                    return this[field];
            };
        }
        get position() {
            return this.validateAbstractObjectImpl("position");
        }
        set position(_) {
            this.hasBeenInitialized.position = true;
        }
        calculateValidMoves() {
            this.validateAbstractObjectImpl("calculateValidMoves");
            return [];
        }
        calculateMoves() {
            this.validateAbstractObjectImpl("calculateMoves");
            return [];
        }
    }
})(Pieces || (Pieces = {}));
export default Pieces;
//# sourceMappingURL=piece.js.map