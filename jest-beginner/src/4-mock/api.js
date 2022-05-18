export const getUsers = async () => {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        return await res.json();
    } catch (err) {
        console.log(err);
    }
};
