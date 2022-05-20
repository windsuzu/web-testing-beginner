import { fireEvent, render, screen } from "@testing-library/react";
import AddInput from "./AddInput";

const MockAddInput = () => <AddInput setTodos={jest.fn()} todos={[]} />;

describe("AddInput", () => {
    test("should render input DOM", () => {
        render(<MockAddInput />);
        const inputDOM = screen.getByPlaceholderText("Add a new task here...");
        expect(inputDOM).toBeInTheDocument();
    });

    test("should render add button", () => {
        render(<MockAddInput />);
        const addBtn = screen.getByText("Add");
        expect(addBtn).toBeInTheDocument();
    });

    test("should be able to type in input", () => {
        render(<MockAddInput />);
        const inputDOM = screen.getByPlaceholderText("Add a new task here...");
        fireEvent.change(inputDOM, { target: { value: "Learn React" } });
        expect(inputDOM.value).toBe("Learn React");
    });

    test("should be able to click add button and clear input", () => {
        render(<MockAddInput />);
        const inputDOM = screen.getByPlaceholderText("Add a new task here...");
        const addBtn = screen.getByText("Add");
        fireEvent.change(inputDOM, { target: { value: "Learn React" } });
        fireEvent.click(addBtn);
        expect(inputDOM.value).toBe("");
    });
});
