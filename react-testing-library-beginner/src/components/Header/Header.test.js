import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("test header using getBy", () => {
    it("title props should work (getByText)", () => {
        render(<Header title="Hello" />);
        const header = screen.getByText(/hello/i);
        expect(header).toBeInTheDocument();
    });

    it("title props should work (getByRole)", () => {
        render(<Header title="Hello" />);

        // If the `title` attribute of a component is defined,
        // the `name` in the options will always equal the `title`,
        // and not the `text (children)`
        const header = screen.getByRole("heading", {
            name: /header/i,
        });
        expect(header).toBeInTheDocument();
    });

    it("title props should work (getByTitle)", () => {
        render(<Header title="Hello" />);
        const header = screen.getByTitle(/header/i);
        expect(header).toBeInTheDocument();
    });

    it("title props should work (getByTestId)", () => {
        render(<Header title="Hello" />);
        const header = screen.getByTestId("header-1");
        expect(header).toBeInTheDocument();
    });

    it("title props should work (getAllBy)", () => {
        render(<Header title="Hello" />);
        const headers = screen.getAllByText(/hello/i);
        expect(headers).toHaveLength(1);
        expect(headers.length).toBe(1);
    });
});

describe("test header using queryBy", () => {
    it("queryBy will return null for further testing", () => {
        render(<Header title="Hello" />);
        const header = screen.queryByText(/other/i);
        expect(header).not.toBeInTheDocument();
    });
});

describe("test header using findBy", () => {
    it("findBy will return result after async/await", async () => {
        render(<Header title="Hello" />);
        const header = await screen.findByText(/hello/i);
        expect(header).toBeInTheDocument();
    });
});
