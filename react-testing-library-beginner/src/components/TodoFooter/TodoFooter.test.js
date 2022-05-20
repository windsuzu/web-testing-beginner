import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TodoFooter from "./TodoFooter";

const MockTodoFooter = ({ taskCount }) => (
    <BrowserRouter>
        <TodoFooter numberOfIncompleteTasks={taskCount} />
    </BrowserRouter>
);

describe("TodoFooter", () => {
    test("should render correct incomplete task count", () => {
        render(<MockTodoFooter taskCount={1} />);
        const taskCount = screen.getByText("1 task left");
        expect(taskCount).toBeInTheDocument();
        expect(taskCount).toContainHTML("p");
    });

    test("should render correct incomplete tasks count", () => {
        render(<MockTodoFooter taskCount={2} />);
        const tasksCount = screen.getByTestId("task-count");
        expect(tasksCount).toHaveTextContent("2 tasks left");
        expect(tasksCount.textContent).toBe("2 tasks left");
    });

    test("should render follower link", () => {
        render(<MockTodoFooter taskCount={0} />);
        expect(screen.getByText(/followers/i)).toBeVisible();
    });
});
