# Jest

* [Before](#before)
* [Installation](#installation)
* [Lesson-1 Matchers](#lesson-1-matchers)
* [Lesson-2 Asynchronous Code](#lesson-2-asynchronous-code)
* [Lesson-3 Before and After Test](#lesson-3-before-and-after-test)
* [Lesson-4 Mock Function](#lesson-4-mock-function)
  * [Mocking Function](#mocking-function)
  * [Mocking Module](#mocking-module)

## Before

You can get a more comprehensive tutorial in the [Introduction section of Jest's Official Documentation](https://jestjs.io/docs/getting-started). Furthermore, you can view the details of each method or function in the [API docs of Jest's Official Documentation](https://jestjs.io/docs/api).

So, please read the documentation first and use my notes below as a handy copy-and-paste toolbox (?) 

## Installation

* Empty project

``` js
// install jest
npm install --save-dev jest
npm i @types/jest

// package.json
{
  "scripts": {
    "test": "jest" // or "jest --watchAll"
  }
}

// install babel
npm install --save-dev babel-jest @babel/core @babel/preset-env

// babel.config.js
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

* Create-React-App

``` js
// keep setupTests.js

// no change needed
"scripts": {
    "test": "react-scripts test",
},
```

## Lesson-1 Matchers

We can use `toBe` to check if the result of the function is equal to a certain value.

``` js
expect(sum(0, 1, 2, -1)).toBe(2);
expect(sum(0, 1, 2, -1)).not.toBe(0);
```

If `toBe` is `===`, you can also check numbers with `>`, `>=`, `<`, `<=`.

``` js
expect(5).toBeGreaterThan(4);
expect(5).toBeGreaterThanOrEqual(5);
expect(5).toBeLessThan(6);
expect(5).toBeLessThanOrEqual(5);
```

Also, be careful to use `toBeCloseTo` instead of `toBe` or `toEqual` to check for floating points.

``` js
const value = 0.1 + 0.2;
expect(value).not.toBe(0.3);
expect(value).toBeCloseTo(0.3);
```

If you want to check the value of an object or an array (immutables), use `toEqual` instead:

``` js
// arr
expect(getArr(3)).not.toBe([1, 2, 3]);
expect(getArr(3)).toEqual([1, 2, 3]);

// obj
expect(person).not.toBe({ age: 18, name: "John" });
expect(person).toEqual({ age: 18, name: "John" });
```

You can use the following method to check the truthiness of the results:

- `toBeNull`
- `toBeUndefined`, `toBeDefined`
- `toBeTruthy`, `toBeFalsy`

``` js
expect(null).toBeNull();
expect(null).toBeDefined();
expect(null).toBeFalsy();

expect(0).not.toBeTruthy();
expect(0).not.toBeNull();
```

You can use `toMatch` to check strings with regex:

``` js
expect("ABC").toMatch(/a/i);
expect("ABC").not.toMatch(/d/i);
```

You can use `toContain` to check if an item is in an array.

``` js
expect(getArr(5)).toContain(5);
expect(getArr(5)).toContain(1);
```

[> View source code](src/1-matchers/matchers.test.js)

## Lesson-2 Asynchronous Code

Let's test our `fetchData` function below.

``` js
export const fetchData = (url) => {
    return new Promise((res, rej) => {
        setTimeout(
            () =>
                url.includes("https")
                    ? res("Done!")
                    : rej("Security Error!"),
            100
        );
    });
};
```

We can test async code with `async/await`.

``` js
test("fetch success", async () => {
        const data = await fetchData("https://example.com");
        expect(data).toMatch(/done/i);
    });

test("fetch error", async () => {
    try {
        await fetchData("http://example.com");
    } catch (error) {
        expect(error).toMatch(/security error/i);
    }
});
```

We can also use `resolves/rejects` in `expect` promise statement. 

``` js
test("fetch success", async () => {
    await expect(fetchData("https://example.com")).resolves.toMatch(/done/i);
});

test("fetch failure", async () => {
    await expect(fetchData("http://example.com")).rejects.toMatch(/security error/i);
});
```

[> View source code](src/2-async/async.test.js)

## Lesson-3 Before and After Test

If you want to prepare something or do something **before/after** each test, you can use `beforeEach` and `afterEach`:

``` js
let arr;
beforeEach(() => { arr = [1, 2, 3]; });

test("arr is [1, 2, 3]", () => { expect(arr.pop()).toEqual(3); });
test("arr is still [1, 2, 3]", () => { expect(arr).toEqual([1, 2, 3]); });
```

If you want to setup **only once** before or after all tests, use `beforeAll` and `afterAll`:

``` js
let arr;
beforeAll(() => { arr = [1, 2, 3]; });

test("arr is [1, 2, 3]", () => { expect(arr.pop()).toEqual(3); });
test("arr is now [1, 2]", () => { expect(arr).toEqual([1, 2]); });
```

Also, note that these setups have a **scoping** feature, for example we can use `describe` to separate these `beforeEach` and `afterEach` setups:

``` js
let arr;
beforeEach(() => { arr = [1, 2, 3]; });

describe("notice scoping", () => {
    beforeAll(() => { arr = [1]; });

    test("beforeEach is called after beforeAll", () => { 
        expect(arr.pop()).toEqual(3);
    });
})
```

[> View source code](src/3-setup/setup.test.js)

## Lesson-4 Mock Function

Sometimes the function we want to test also has other dependencies, such as `fetch` or other functions. Such dependencies may get out of control, so you want to mock them and return a reliable result for the core tests. 

### Mocking Function

Before we spy and mock the `fetch` api, we need to know how to mock a simple function. 

Jest gives us `jest.fn()` to create a simple function mock. A function mock can simulate everything a normal function or an asynchronous function can do. We can use `.mockImplementation(func)` or `.mockImplementationOnce(func)` to simulate a normal function or an async function.

If you only want to mock the return value of a function, you can use `.mockReturnValue()`, `.mockReturnValueOnce()` as returns for normal functions, and use `.mockResolvedValue()`, `.mockResolvedValueOnce()` `.mockRejectedValue()`, `.mockRejectedValueOnce()` as returns for async functions.

``` js
const mockFn = jest.fn();

// normal function mock
mockFn.mockImplementationOnce((msg) => { return "Hello " + msg; });

// async function mock
mockFn.mockImplementationOnce((msg) => { return Promise.resolve("Hello " + msg); });
mockFn.mockImplementationOnce((msg) => { return Promise.reject("Error"); });

// normal return mock
mockFn.mockReturnValueOnce("Hello World");

// async return mock
mockFn.mockResolvedValueOnce("Hello World");
mockFn.mockRejectedValueOnce("Error");
```

We are able to **detect the calls and arguments** from the function mock using `toBeCalled()` and `toBeCalledWith()`.

``` js
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
```

Remember, we have to clear the mock history between each test.

``` js
afterEach(() => {
    jest.clearAllMocks(); // or mockFn.mockClear();
});
```

### Mocking Module

Now let's test on a real world example. Say we have a function `getUserNames()` that calls `getUsers()`, retrieves a user list `data`, and returns all usernames. 

``` js
// api.js
export const getUsers = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    return await res.json();
}

// utils.js
export const getUserNames = async () => {
    const data = await getUsers();
    return data.map((user) => user.name);
};
```

To test `getUserNames` without any possible side effects, we can mock either `fetch` or `getUsers` to return the results as we want. Here we first demonstrate how to spy and mock the return value of `getUsers` by using `jest.spyOn()`:

> With the `jest.spyOn`, you can replace an existing method of any class or imported module, to a function mock.

``` js
import * as api from "./api";
import { getUserNames } from "./util";

afterEach(() => { 
    jest.restoreAllMocks(); 
});

test("getUserNames should work after spyOn getUsers", async () => {
    const getUserMock = jest.spyOn(api, "getUsers");
    getUserMock.mockImplementation(() => {
        return Promise.resolve([
            { id: 1, name: "John" },
            { id: 2, name: "Jane" },
        ]);
    });

    await expect(getUserNames()).resolves.toEqual(["John", "Jane"]);
    expect(getUserMock).toBeCalled();
    expect(getUserMock).toBeCalledTimes(1);
    expect(getUserMock).toBeCalledWith();
});
```

Next, we can also use `jest.mock()` to mock **every function** in `api`. Here we only have `getUsers` in `api`, so we only need to define its function mock:

> `jest.mock` can overwrite every whole module and provide its replacement.

``` js
jest.mock("./api", () => ({
    // if you have other function and don't want to mock them
    // ...jest.requireActual('./api'),
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
```

Lastly, in order to mock the browser function `fetch` in our tests, we can use a little trick to define `global.fetch` as a mock function.

``` js
test("getUserNames should work after spyOn fetch", async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            json: () =>
                Promise.resolve([
                    { id: 1, name: "John" },
                    { id: 2, name: "Jane" },
                ]),
        });
    });
    await expect(require("./util").getUserNames()).resolves.toEqual([
        "John",
        "Jane",
    ]);
});
```

- [> View source code](src/4-mock/util.test.js)
- [> More Jest Mock explanation from *kwieccia*](https://github.com/kwieccia/jest-mocks-101)