import ChessAnimation from "../animation.js";
import Chess, { PawnMoves, PawnState, PieceType } from "../chess.js";
import ChessState from "../chess_state.js";
import { assert, match } from "../utils.js";
import Piece from "./pieces.js";

export default class Pawn extends Piece<PawnMoves> {
  name: PieceType = "pawn";
  captureMoves: string[] = [];
  moves: string[] | null = null;

  constructor(position: string, signal?: AbortSignal) {
    super(position, signal);

    (ChessState.boardState[position]!.pieceState as PawnState).enPassantLiable =
      false;
  }

  canPromote(pos: string): boolean {
    switch (ChessState.turn) {
      case "black":
        if (pos[1] === "8") {
          return true;
        }
      case "white":
        if (pos[1] === "1") {
          return true;
        }
    }

    return false;
  }

  calculateMoves() {
    if (this.moves) return;

    const posObj = ChessState.boardState[this.position]!;
    assert(posObj?.pieceName === "pawn");

    /*
     * Pawns move forward once if they have moved before
     * Pawns move forward twice if they haven't moved before
     * Pawns can move diagonally to capture a piece
     */

    this.moves = [];

    this.moves.push(
      ...match(
        ChessState.turn,
        {
          white: () => [Chess.offsetPosition(this.position, [0, -1])],
          black: () => [Chess.offsetPosition(this.position, [0, 1])],
        },
        [],
      ),
    );

    if (!(posObj.pieceState as PawnState).hasMoved) {
      try {
        this.moves.push(
          ...match(
            ChessState.turn,
            {
              white: () => [Chess.offsetPosition(this.position, [0, -2])],
              black: () => [Chess.offsetPosition(this.position, [0, 2])],
            },
            [],
          ),
        );
      } catch {}
    }

    // Left Diagonal
    try {
      this.captureMoves.push(
        match(ChessState.turn, {
          white: () => Chess.offsetPosition(this.position, [-1, -1]),
          black: () => Chess.offsetPosition(this.position, [1, 1]),
        }),
      );
    } catch {}

    // Right Diagonal
    try {
      this.captureMoves.push(
        match(ChessState.turn, {
          white: () => Chess.offsetPosition(this.position, [1, -1]),
          black: () => Chess.offsetPosition(this.position, [-1, 1]),
        }),
      );
    } catch {}
  }

  calculateValidMoves(): void {
    if (this.validMoves) return;

    if (!this.moves) this.calculateMoves();

    this.validMoves = {
      move: [],
      capture: {
        capture: [],
      },
      promote: {
        capture: [],
      },
    };

    // TODO: Make pawns capable of handling enpassant

    /*
     * If there's no piece in it's way, the pawn can move forward
     * unless it's a diagonal where the pawn can capture if the color is opposite of it's own
     */

    for (const pos of this.moves!) {
      if (ChessState.boardState[pos]!.pieceName) break;

      if (this.canPromote(pos)) {
        this.validMoves.promote.move = pos;
        continue;
      }

      this.validMoves.move.push(pos);
    }

    this.captureMoves.forEach((pos) => {
      // Check for capturing first before enpassant
      if (ChessState.boardState[pos]!.pieceColor === Chess.getOppPieceColor()) {
        if (this.canPromote(pos)) {
          this.validMoves?.promote.capture.push(pos);
          return;
        }

        this.validMoves?.capture.capture.push(pos);
        return;
      } else {
        if (this.validMoves?.capture.enPassant) return;
        try {
          const enPassantPos = match(ChessState.turn, {
            white: () => Chess.offsetPosition(pos, [0, 1]),
            black: () => Chess.offsetPosition(pos, [0, -1]),
          });

          if (
            (ChessState.boardState[enPassantPos]!.pieceState as PawnState)
              .enPassantLiable
          ) {
            this.validMoves!.capture.enPassant = [pos, enPassantPos];
          }
        } catch {}
      }
    });
  }

  addEventListeners() {
    assert(this.signal);

    ChessState.boardState[this.position]?.element.addEventListener(
      "click",
      () => {
        if (ChessAnimation.isAnimating) return;
        this.calculateValidMoves();

        if (ChessState.currentHintPos === this.position) ChessState.hideHints();
        else ChessState.showHints(this.position);
      },
      {
        signal: this.signal!,
      },
    );
  }

  pieceCallback(to: string) {
    const fromState = ChessState.boardState[this.position]!
      .pieceState! as PawnState;

    if (
      !fromState.hasMoved &&
      this.position[0] === to[0] &&
      Math.abs(Number(this.position[1]) - Number(to[1])) === 2
    ) {
      fromState.enPassantLiable = true;
    } else {
      fromState.enPassantLiable = false;
    }

    fromState.hasMoved = true;
  }
}
