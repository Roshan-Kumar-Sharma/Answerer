
exports.getFullUrl = (req) => {
    const protocol = req.protocol;
    const host = req.hostname;
    const port = 2000;
    const fullUrl = `${protocol}://${host}${
        [80, 443].includes(port) ? "" : `:${port}`
    }`;

    return fullUrl;
};
