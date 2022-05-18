export const sum = (...args) => {
    return args.reduce((acc, curr) => acc + curr, 0);
};

export const getArr = (len) => {
    return Array(len)
        .fill(0)
        .map((_, i) => i + 1);
};
