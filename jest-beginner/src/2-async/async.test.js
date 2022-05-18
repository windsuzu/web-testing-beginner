import { fetchData } from "./async";

describe("async await", () => {
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
});

describe("resolves / rejects", () => {
    test("fetch success", async () => {
        await expect(fetchData("https://example.com")).resolves.toMatch(
            /done/i
        );
    });

    test("fetch failure", async () => {
        await expect(fetchData("http://example.com")).rejects.toMatch(
            /security error/i
        );
    });
});
