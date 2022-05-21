# React-testing-library

* [Before](#before)
* [Installation](#installation)
* [Test Structure](#test-structure)
* [Find the Elements](#find-the-elements)
  * [Example](#example)
* [Assertions](#assertions)
* [FireEvents](#fireevents)
* [Asynchronous](#asynchronous)
* [Mocks](#mocks)
  * [Mocking Components](#mocking-components)
  * [Mocking useState Functions](#mocking-usestate-functions)
  * [Mocking APIs](#mocking-apis)
* [Before & After Each](#before--after-each)
* [Integration Tests](#integration-tests)

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

### Mocking Components

``` js
const MockTodoFooter = ({ taskCount }) => (
    <BrowserRouter>
        <TodoFooter numberOfIncompleteTasks={taskCount} />
    </BrowserRouter>
);

render(<MockTodoFooter taskCount={1} />);
```

### Mocking useState Functions

``` js
const MockAddInput = () => (
  <AddInput 
    todos={[]}
    setTodos={jest.fn()} />;
)

render(<MockAddInput />);
```


### Mocking APIs

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

``` js
it("should render multiple followers", async () => {
    render(<MockFollowerList />);
    const followers = await screen.findAllByTestId(/follower-item/i);
    expect(followers.length).toBe(5);
});
```

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

typeinput addbutton clearinput showintodolist

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
