namespace Pieces {
  interface IPiece {
    position: string;
    calculateMoves<T>(): T[];
    calculateValidMoves<T>(): T[];
  }

  type IHasBeenInitialized = {
    [K in keyof IPiece]: boolean;
  };

  abstract class Piece implements IPiece {
    hasBeenInitialized: IHasBeenInitialized = {
      position: false,
      calculateMoves: false,
      calculateValidMoves: false,
    };

    validateAbstractObjectImpl;

    constructor() {
      this.validateAbstractObjectImpl = (field: keyof IHasBeenInitialized) => {
        if (!this.hasBeenInitialized[field]) {
          throw new Error(
            `The field ${field} of abstract class 'Piece' was used without initialization`,
          );
        }

        if (typeof field !== "function") return this[field as keyof Piece];
      };
    }

    get position(): string {
      return this.validateAbstractObjectImpl("position") as string;
    }

    set position(_) {
      this.hasBeenInitialized.position = true;
    }

    calculateValidMoves(): [] {
      this.validateAbstractObjectImpl("calculateValidMoves");
      return [];
    }

    calculateMoves(): [] {
      this.validateAbstractObjectImpl("calculateMoves");
      return [];
    }
  }
}

export default Pieces;
