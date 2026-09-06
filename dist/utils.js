class AssertionError extends Error {
    constructor(message) {
        super(message);
    }
}
export function isMultipleOf(n1, n2) {
    return n1 % n2 === 0;
}
export function assert(condition) {
    if (!condition)
        throw new AssertionError(`Assertion Error: Assertion failed for condition ${condition}`);
}
export function match(value, cases, def) {
    for (const pattern in cases) {
        if (pattern === value)
            return cases[pattern]();
    }
    if (def !== undefined)
        return def;
    throw new Error(`Could not find any match for value ${String(value)}`);
}
//# sourceMappingURL=utils.js.map