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
//# sourceMappingURL=utils.js.map