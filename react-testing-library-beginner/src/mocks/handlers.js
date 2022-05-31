import { rest } from "msw";

export const handlers = [
    rest.get("https://randomuser.me/api", (req, res, ctx) => {
        const resultsCount = req.url.searchParams.get("results");
        console.log(resultsCount);

        return res(
            ctx.status(200),
            ctx.json({
                results: [
                    {
                        name: { first: "John", last: "Doe" },
                        login: { username: "johndoe" },
                        picture: {
                            large: "https://randomuser.me/api/portraits/men/1.jpg",
                        },
                    },
                    {
                        name: { first: "Addison", last: "Bergeron" },
                        login: { username: "addison.bergeron" },
                        picture: {
                            large: "https://randomuser.me/api/portraits/women/71.jpg",
                        },
                    },
                ],
            })
        );
    }),
];
