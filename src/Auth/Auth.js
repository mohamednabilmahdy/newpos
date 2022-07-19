import jwt from "jsonwebtoken";

export default (request) => {
    const header = request.req.headers.authorization;

    // not found
    if (!header) return { isAuth: false };

    // token
    const token = header.split(" ");

    // token not found
    if (!token) return { isAuth: false };

    let decodeToken;

    try {
        decodeToken = jwt.verify(token[1], process.env.SECRET);
    } catch (err) {
        return { isAuth: false };
    }

    // in case any error found
    if (!!!decodeToken) return { isAuth: false };

    // token decoded successfully, and extracted data
    return { isAuth: true, id: decodeToken.id };
};