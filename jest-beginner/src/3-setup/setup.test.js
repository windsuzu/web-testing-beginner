let arr;

beforeEach(() => {
    arr = [1, 2, 3];
});

afterEach(() => {
    arr = [];
});

test("arr is [1, 2, 3]", () => {
    expect(arr.pop()).toEqual(3);
});

test("arr is still [1, 2, 3]", () => {
    expect(arr).toEqual([1, 2, 3]);
});

describe("notice scoping", () => {
    beforeAll(() => {
        arr = [1];
    });

    test("beforeEach is called after beforeAll", () => {
        // arr = [1, 2, 3] because of beforeEach is called after beforeAll
        expect(arr.pop()).toEqual(3);
    });
});
