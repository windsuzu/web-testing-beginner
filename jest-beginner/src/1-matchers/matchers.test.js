import { sum, getArr } from "./matchers";

describe("function", () => {
    test("to be or not to be", () => {
        expect(sum(0, 1, 2, -1)).toBe(2);
        expect(sum(0, 1, 2, -1)).not.toBe(0);
    });
});

describe("array or object", () => {
    test("arr", () => {
        expect(getArr(3)).not.toBe([1, 2, 3]);
        expect(getArr(3)).toEqual([1, 2, 3]);
        expect(getArr(5)).toContain(5);
        expect(getArr(5)).toContain(1);
    });

    test("obj", () => {
        const person = { age: 18, name: "John" };
        expect(person).not.toEqual({ age: 18 });
        expect(person).not.toBe({ age: 18, name: "John" });
        expect(person).toEqual({ age: 18, name: "John" });
    });
});

describe("truthiness", () => {
    test("null", () => {
        expect(null).toBeNull();
        expect(null).toBeDefined();
        expect(null).toBeFalsy();
    });

    test("0", () => {
        expect(0).not.toBeTruthy();
        expect(0).not.toBeNull();
    });
});

describe("string", () => {
    test("match", () => {
        expect("ABC").toMatch(/a/i);
        expect("ABC").not.toMatch(/d/i);
    });
});

describe("number", () => {
    test("give me five", () => {
        expect(5).toBeGreaterThan(4);
        expect(5).toBeGreaterThanOrEqual(5);
        expect(5).toBeLessThan(6);
        expect(5).toBeLessThanOrEqual(5);
    });

    test("float", () => {
        const value = 0.1 + 0.2;
        expect(value).not.toBe(0.3);
        expect(value).toBeCloseTo(0.3);
    });
});
