// import * as api from "./api";
// import { getUserNames } from "./util";

afterEach(() => {
    jest.clearAllMocks(); // or mockFn.mockClear();
});

// Mocking Function
describe("Mocking Function", () => {
    const mockFn = jest.fn();

    test("mockFn normal function", () => {
        mockFn.mockImplementationOnce((msg) => {
            return "Hello " + msg;
        });

        const result = mockFn("World");
        expect(result).toBe("Hello World");

        expect(mockFn).toBeCalled();
        expect(mockFn).toBeCalledTimes(1);
        expect(mockFn).toBeCalledWith("World");
    });

    test("mockFn promise function", async () => {
        mockFn.mockImplementationOnce((msg) => {
            return Promise.resolve("Hello " + msg);
        });

        const result = await mockFn("World");
        expect(result).toBe("Hello World");

        expect(mockFn).toBeCalled();
        expect(mockFn).toBeCalledTimes(1);
        expect(mockFn).toBeCalledWith("World");
    });

    test("mockFn return value", async () => {
        mockFn.mockReturnValueOnce("Hello World");
        mockFn.mockResolvedValueOnce("Hello World");
        mockFn.mockRejectedValueOnce("Error");

        expect(mockFn("any", "argument")).toBe("Hello World");
        await expect(mockFn("any", "args")).resolves.toBe("Hello World");
        await expect(mockFn("any", "args")).rejects.toMatch(/error/i);
    });
});

// Mocking Module
describe("Use mock() to test getUserNames from utils", () => {
    jest.mock("./api", () => ({
        getUsers: jest.fn(() =>
            Promise.resolve([
                { id: 1, name: "John" },
                { id: 2, name: "Jane" },
            ])
        ),
    }));
    test("getUserNames should work after mock getUsers", async () => {
        await expect(require("./util").getUserNames()).resolves.toEqual([
            "John",
            "Jane",
        ]);
    });
});

describe("Use spyOn() to test getUserNames from utils", () => {
    test("getUserNames should work after spyOn getUsers", async () => {
        const getUserMock = jest.spyOn(require("./api"), "getUsers");
        getUserMock.mockImplementation(() => {
            return Promise.resolve([
                { id: 1, name: "John" },
                { id: 2, name: "Jane" },
            ]);
        });
        await expect(require("./util").getUserNames()).resolves.toEqual([
            "John",
            "Jane",
        ]);
        expect(getUserMock).toBeCalled();
        expect(getUserMock).toBeCalledTimes(1);
        expect(getUserMock).toBeCalledWith();
    });
});

// describe("Use jest.fn() to mock fetch api and test getUserNames from utils", () => {
//     test("getUserNames should work after spyOn fetch", async () => {
//         global.fetch = jest.fn().mockImplementation(() => {
//             return Promise.resolve({
//                 json: () =>
//                     Promise.resolve([
//                         { id: 1, name: "John" },
//                         { id: 2, name: "Jane" },
//                     ]),
//             });
//         });
//         await expect(require("./util").getUserNames()).resolves.toEqual([
//             "John",
//             "Jane",
//         ]);
//     });
// });
