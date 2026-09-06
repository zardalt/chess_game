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

export function match<T extends string | number | symbol, U, V>(
  value: Partial<T>,
  cases: Record<T, () => U>,
  def?: V,
): U | V {
  for (const pattern in cases) {
    if (pattern === value) return cases[pattern]();
  }

  if (def !== undefined) return def;
  throw new Error(`Could not find any match for value ${String(value)}`);
}
