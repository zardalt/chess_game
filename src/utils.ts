class AssertionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function isMultipleOf(n1: number, n2: number): boolean {
  return n1 % n2 === 0;
}

export function assert(condition: any) {
  if (!condition)
    throw new AssertionError(
      `Assertion Error: Assertion failed for condition ${condition}`,
    );
}
