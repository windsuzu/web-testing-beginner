import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { server } from "../../mocks/server";
import FollowersList from "./FollowersList";

const MockFollowerList = () => (
    <BrowserRouter>
        <FollowersList />
    </BrowserRouter>
);

// describe("render followers with real api (not a good approach)", () => {
//     it("should render the first follower", async () => {
//         render(<MockFollowerList />);
//         const follower = await screen.findByTestId("follower-item-0");
//         expect(follower).toBeInTheDocument();
//     });

//     it("should render multiple followers", async () => {
//         render(<MockFollowerList />);
//         const followers = await screen.findAllByTestId(/follower-item/i);
//         expect(followers.length).toBe(5);
//     });
// });

// describe("render followers with mock api (a better approach)", () => {
//     const mockResponse = {
//         data: {
//             results: [
//                 {
//                     name: { first: "John", last: "Doe" },
//                     login: { username: "johndoe" },
//                     picture: {
//                         large: "https://randomuser.me/api/portraits/men/1.jpg",
//                     },
//                 },
//             ],
//         },
//     };

//     it("should render only 1 follower", async () => {
//         const mockAxiosGet = jest.spyOn(axios, "get");
//         mockAxiosGet.mockResolvedValue(mockResponse);

//         render(<MockFollowerList />);
//         const followers = await screen.findAllByTestId(/follower-item/i);
//         expect(followers.length).toBe(1);
//         expect(followers[0]).toHaveTextContent("John Doe");
//         expect(mockAxiosGet).toHaveBeenCalledTimes(1);
//     });
// });

describe("render followers with msw", () => {
    it("should render two followers from our msw handlers", async () => {
        render(<MockFollowerList />);
        const followers = await screen.findAllByTestId(/follower-item/i);
        expect(followers.length).toBe(2);
        expect(followers[0]).toHaveTextContent("John Doe");
        expect(followers[1]).toHaveTextContent("Addison Bergeron");
    });

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
});
