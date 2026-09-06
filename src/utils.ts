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

export function* enumerate<T, U>(iter: T[], iter2: U[]) {
  for (let i = 0; i < Math.max(iter.length, iter2.length); i++) {
    yield [iter[i], iter2[i]];
  }
}

export function compare<T>(v1: T, v2: T): boolean {
  if (Array.isArray(v1)) {
    assert(Array.isArray(v2));
    if ((v1 as []).length !== (v2 as []).length) return false;
    for (const [vl1, vl2] of enumerate(v1 as [], v2 as [])) {
      if (vl1 !== vl2) return false;
    }
  } else if (typeof v1 === "object") {
    assert(typeof v2 === "object");
    const entries = Object.entries(v1 as object);
    const v2entries = Object.entries(v2 as object);

    if (entries.length !== v2entries.length) return false;

    // Compare keys
    for (const [vl1, vl2] of enumerate(
      entries.map((ent) => ent[0]),
      v2entries.map((ent) => ent[0]),
    )) {
      if (vl1 !== vl2) return false;
    }

    // Compare values
    for (const [vl1, vl2] of enumerate(
      entries.map((ent) => ent[1]),
      v2entries.map((ent) => ent[1]),
    )) {
      if (typeof vl1 === "object" || typeof vl2 === "object") {
        if (typeof vl2 !== "object" || typeof vl1 !== "object") return false;

        if (!compare(vl1, vl2)) return false;
      } else if (vl1 !== vl2) return false;
    }
  }

  return true;
}

export function test(desc: string, testCase: () => void) {
  try {
    testCase();
    console.log(`%c${desc} ...PASSED`, "color: blue;");
  } catch {
    console.log(`%c${desc} ...FAILED`, "color: red;");
  }
}
