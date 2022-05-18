export const fetchData = (url) => {
    return new Promise((res, rej) => {
        try {
            setTimeout(
                () =>
                    url.includes("https")
                        ? res("Done!")
                        : rej("Security Error!"),
                100
            );
        } catch (error) {
            rej("Error!");
        }
    });
};
