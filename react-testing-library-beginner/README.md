# React-testing-library

* [Before](#before)
* [Installation](#installation)
* [Test Structure](#test-structure)
* [Find the Elements](#find-the-elements)
* [Example](#example)
* [Assertions](#assertions)
* [FireEvents](#fireevents)
* [Mocks](#mocks)
* [Mocking Components](#mocking-components)
* [Mocking useState Functions](#mocking-usestate-functions)
* [Mocking APIs](#mocking-apis)
* [Asynchronous](#asynchronous)
* [Before & After Each](#before--after-each)
* [Integration Tests](#integration-tests)
* [MSW (Mock Service Worker)](#msw-mock-service-worker)

## Before

[React-testing-library](https://testing-library.com/docs/react-testing-library/intro) is a submodule of [testing-library](https://testing-library.com/docs/). You can read the documentation from the links, but I recommend watching [Netninja and Laith Harb's tutorial](https://www.youtube.com/watch?v=7dTTFW7yACQ&list=PL4cUxeGkcC9gm4_-5UsNmLqMosM-dzuvQ&index=1).


## Installation

If you are using **create-react-app**, you should already have `react-testing-library` installed in your project. 

```
npm install --save-dev @testing-library/react
```

## Test Structure

There is a general formula to test everything in your react app. When you test any component, you can go through the following steps:

1. Create a test block by `test()` or `it()`
2. Render the component you want to test
3. **Get** or **query** or **find** the elements we want to interact with
4. Interact with those elements
5. Assert the results are as expected

Here is an example of a test structure from [AddInput.test.js](src/components/AddInput/AddInput.test.js)

``` js
// 1.
test("should be able to type in input", () => {
    // 2.
    render(<MockAddInput />);

    // 3.
    const inputDOM = screen.getByPlaceholderText("Add a new task here...");

    // 4.
    fireEvent.change(inputDOM, { target: { value: "Learn React" } });

    // 5.
    expect(inputDOM.value).toBe("Learn React");
});
```

## Find the Elements

There are 3 ways to find the element we want to interact with, namely `getByXXX`, `queryByXXX`, and `findByXXX`. All of them also have a corresponding method for finding all matching elements, i.e. `getAllByXXX`, `queryAllByXXX`, and `findAllByXXX`. We can simply distinguish the differences between the 3 methods by the following rules:

1. If we cannot find the element, `getBy` will throw an **error**, but `queryBy` will return **null**
2. If we cannot find any element, `queryAllBy` will return an **empty array**.
3. Only `findBy` can handle elements related to **async/await**
4. If there are multiple matching elements, `getBy`, `queryBy`, `findBy` will throw an **error**

|             | getBy  | queryBy | findBy | getAllBy | queryAllBy | findAllBy |
| ----------- | ------ | ------- | ------ | -------- | ---------- | --------- |
| No match    | error  | null    | error  | error    | []         | error     |
| 1 Match     | return | return  | return | array    | array      | array     |
| N Matches   | error  | error   | error  | array    | array      | array     |
| Async/Await | no     | no      | yes    | no       | no         | yes       |

When you want to find the element to interact with, you should consider the user's experience when using these elements, and take the following order to get them.

1. `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByDisplayValue` (**Accessible by everyone**)
2. `getByAltText` > `getByTitle` (**Accessible by robots**)
3. `getByTestId` (**No one can access**)

### Example

Let's test how to find the elements on our `Header.js`:

> If the `title` attribute of a component is defined, then when you use `getByRole`, the `name` in the options will always equal the `title` and not the `text (children)`

``` js
// Header.js
export default function Header({ title }) {
    return (
      <h1 title="Header" className="header" data-testid="header-1">
        {title}
      </h1>
    );
}
```

These are some `getBy` and `getAllBy` examples:

``` js
render(<Header title="Hello" />);

const header = screen.getByText(/hello/i);
const header = screen.getByRole("heading", { name: /header/i });
const header = screen.getByTitle(/header/i);
const header = screen.getByTestId("header-1");

expect(header).toBeInTheDocument();

const headers = screen.getAllByText(/hello/i);
expect(headers).toHaveLength(1);
expect(headers.length).toBe(1);
```

A `queryBy` example:

``` js
it("queryBy will return null for further testing", () => {
    render(<Header title="Hello" />);
    const header = screen.queryByText(/other/i);
    expect(header).not.toBeInTheDocument();
});
```

A `findBy` example:

``` js
it("findBy will return result after async/await", async () => {
    render(<Header title="Hello" />);
    const header = await screen.findByText(/hello/i);
    expect(header).toBeInTheDocument();
});
```

[> View source code](src/components/Header/Header.test.js)

## Assertions

When we want to validate the behavior, text, or value of our components, we can use the [assertions we learned in Jest](../jest-beginner/), such as `toBe`, `toEqual`, or `toMatch`.

``` js
expect(headers.length).toBe(1);
expect(tasksCount.textContent).toBe("2 tasks left");
expect(inputDOM.value).toBe("Learn React");
```

Or, we can utilize some of the assertion functions that are built into `react-testing-library`.

``` js
expect(header).toBeInTheDocument();
expect(screen.getByText(/followers/i)).toBeVisible();
expect(taskCount).toContainHTML("p");
expect(tasksCount).toHaveTextContent("2 tasks left");
expect(todo).toHaveClass("todo-item-active");
```

## FireEvents

Sometimes we also want to interact with our components, like clicking a button or typing something into our input field. We can achieve these interaction by using `fireEvent` in `react-testing-library`. 

``` js
import { fireEvent, render, screen } from "@testing-library/react";

const inputDOM = screen.getByPlaceholderText("Add a new task here...");
const addBtn = screen.getByText("Add");
fireEvent.change(inputDOM, { target: { value: "Learn React" } });
fireEvent.click(addBtn);
expect(inputDOM.value).toBe("");
```

## Mocks

When you test components, there are many things you can and should mock. Because these things are not what you should mainly focus on but still need to implement.

### Mocking Components

The component you are testing may need to be wrapped by another parent component. In this case, we can create a mock component that wraps the test component with the required parent component.

``` js
const MockTodoFooter = ({ taskCount }) => (
    <BrowserRouter>
        <TodoFooter numberOfIncompleteTasks={taskCount} />
    </BrowserRouter>
);

render(<MockTodoFooter taskCount={1} />);
```

### Mocking useState Functions

Sometimes we need to pass props to a component, and props may include functions such as `setTodos` in useState. We can replace them by passing function mock - `jest.fn()` instead. 

``` js
const MockAddInput = () => (
  <AddInput 
    todos={[]}
    setTodos={jest.fn()} />;
)

render(<MockAddInput />);
```

### Mocking APIs

Some components display content after calling some APIs. And we already know that it is a bad practice to fetch the real API while testing. So we should mock API requests when testing these components as well.

``` js
const mockResponse = {
    data: {
        results: [
            {
                name: { first: "John", last: "Doe" },
                login: { username: "johndoe" },
                picture: {
                    large: "https://randomuser.me/api/portraits/men/1.jpg",
                },
            },
        ],
    },
};

const mockAxiosGet = jest.spyOn(axios, "get");
mockAxiosGet.mockResolvedValue(mockResponse);
```

## Asynchronous

An example of asynchronous testing with a real API.

``` js
it("should render multiple followers", async () => {
    render(<MockFollowerList />);
    const followers = await screen.findAllByTestId(/follower-item/i);
    expect(followers.length).toBe(5);
});
```

An example of asynchronous testing with a mock API.

``` js
it("should render only 1 follower", async () => {
    const mockAxiosGet = jest.spyOn(axios, "get");
    mockAxiosGet.mockResolvedValue(mockResponse);

    render(<MockFollowerList />);
    const followers = await screen.findAllByTestId(/follower-item/i);
    expect(followers.length).toBe(1);
    expect(mockAxiosGet).toHaveBeenCalledTimes(1);
});
```

## Before & After Each

Same as in jest. You can set up anything in `beforeEach` or `beforeAll`, or dispose anything in `afterEach` or `afterAll`. 

## Integration Tests

You can think of integration tests as a combination of multiple unit tests. During a integration test, we test whether the interaction between multiple components works as expected. 

We can say that the following test is an integration test:

1. Test if we can type anything into the input field.
2. Test if the input field is cleared if we click the Add button.
3. Test if the input is added to the todo list if we click the Add button.

``` js
const addTask = (tasks) => {
    tasks.forEach((task) => {
        const inputDOM = screen.getByPlaceholderText("Add a new task here...");
        const addBtn = screen.getByText("Add");
        fireEvent.change(inputDOM, { target: { value: task } });
        fireEvent.click(addBtn);
        expect(inputDOM.value).toBe("");
    });
};

describe("add todo", () => {
    test("add todo should be rendered in todolist", () => {
        render(<MockTodo />);
        addTask(["Learn React"]);
        const todo = screen.getByText("Learn React");
        expect(todo).toBeInTheDocument();
    });

    test("add multiple todos should be rendered in todolist", () => {
        render(<MockTodo />);
        addTask(["Learn React", "Learn Redux"]);
        const todos = screen.getAllByTestId("todo");
        expect(todos.length).toBe(2);
    });
});
```

## MSW (Mock Service Worker)

> You can get a quick overview of MSW from this [YouTube crash course](https://www.youtube.com/watch?v=oMv2eAGWtZU).

According to [msw official introduction](https://mswjs.io/docs/), Mock Service Worker is an API mocking library that uses Service Worker API to intercept actual requests. And we can use `MSW` not only in our testing phase but also in development phase.

First, we need to install `msw` to our dev-dependencies from either `npm` or `yarn`:

```
npm install msw --save-dev
# or
yarn add msw --dev
```

Next, we can create a single directory to handle all the modules related to mocking. Here we create a `src/mocks` directory and create a [`src/mocks/handlers.js`](src/mocks/handlers.js) to have all our request handlers.

``` js
// src/mocks/handlers.js

import { rest } from 'msw'

export const handlers = [
    rest.get("https://randomuser.me/api", (req, res, ctx) => {

        // If the client's request is `https://randomuser.me/api?results=5`
        // the `resultsCount` will be equal to 5
        const resultsCount = req.url.searchParams.get("results");

        return res(
            ctx.status(200),
            ctx.json({ results: [ ... ]})
        );
    }),
];
```

After we define all the api handlers, we need to add a new [`src/mocks/server.js`](src/mocks/server.js) to intercept all the requests and return mock data to these requests.

``` js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

Then we can go to [setupTests.js](src/setupTests.js) created by `create-react-app`, and start our mock server. 

``` js
import { server } from "./mocks/server.js";

// Establish API mocking before all tests.
// onUnhandledRequest will return error 
// when we face any request that is not being intercepted
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
```

Finally, let's move to [FollowerList.test.js](src/components/FollowersList/FollowerList.test.js) and see how we can test with `msw`. 

When we `render(<MockFollowerList />)`, the api (`https://randomuser.me/api/?results=5`) will be called in the `useEffect()` in our `<FollowerList />`. Then, our [`src/mocks/server.js`](src/mocks/server.js) will intercept the api request, and return the mock data we defined in [`src/mocks/handlers.js`](src/mocks/handlers.js).

``` js
it("should render two followers from our msw handlers", async () => {
    render(<MockFollowerList />);
    const followers = await screen.findAllByTestId(/follower-item/i);
    expect(followers.length).toBe(2);
    expect(followers[0]).toHaveTextContent("John Doe");
    expect(followers[1]).toHaveTextContent("Addison Bergeron");
});
```

Now, we also want to test the error scenario when our server is down. we can mock the server, request, and response directly in our test block using `server.use()`:

``` js
import { rest } from "msw";
import { server } from "../../mocks/server";

it("should render nothing when fetching error", async () => {
    server.use(
        rest.get("https://randomuser.me/api", (req, res, ctx) => {
            return res(
                ctx.status(500),
                ctx.json({ message: "Server Error" })
            );
        })
    );

    render(<MockFollowerList />);
    const error = await screen.findByText(/server error/i);
    expect(error).toBeInTheDocument();
});
```

### Using in the development phase

The mocking functionality provided by `msw` is not only convenient for testing purposes, but also benefits the development phase. We can follow [Mock Service Worker / Integrate / Browser](https://mswjs.io/docs/getting-started/integrate/browser) to set up `msw` for development, so that we can use the mock data returned by the [`src/mocks/handlers`](src/mocks/handlers.js) when developing our application.

1. Install `mockServiceWorker` in the `public/` folder:

``` js
npx msw init public/ --save
```

2. Set up request intercept function in [`src/mocks/browser.js`](src/mocks/browser.js), as we did in `server.js`.

``` js
import { setupWorker } from "msw";
import { handlers } from "./handlers";

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
```

3. Start the worker in your application's root [`index.js`](src/index.js).

``` js
if (process.env.NODE_ENV === "development") {
    const { worker } = require("./mocks/browser");
    worker.start();
}
```

4. Now all your requests will be intercepted, and `msw` will return mock data to your client browser.