import { getUsers } from "./api";

export const getUserNames = async () => {
    const data = await getUsers();
    return data.map((user) => user.name);
};
