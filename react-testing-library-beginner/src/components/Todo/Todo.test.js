import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Todo from "./Todo";

const MockTodo = () => (
    <BrowserRouter>
        <Todo />
    </BrowserRouter>
);

const addTask = (tasks) => {
    tasks.forEach((task) => {
        const inputDOM = screen.getByPlaceholderText("Add a new task here...");
        const addBtn = screen.getByText("Add");
        fireEvent.change(inputDOM, { target: { value: task } });
        fireEvent.click(addBtn);
        expect(inputDOM.value).toBe("");
    });
};

describe("Todo", () => {
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

    describe("check todo as completed", () => {
        test("todo should not be completed initially", () => {
            render(<MockTodo />);
            addTask(["Learn React"]);
            const todo = screen.getByText("Learn React");
            expect(todo).not.toHaveClass("todo-item-active");
        });

        test("todo should be completed after click on it", () => {
            render(<MockTodo />);
            addTask(["Learn React"]);
            const todo = screen.getByText("Learn React");
            fireEvent.click(todo);
            expect(todo).toHaveClass("todo-item-active");
        });
    });
});
