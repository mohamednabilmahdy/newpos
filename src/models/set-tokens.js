import { validateAccessToken, validateRefreshToken } from "./validate-tokens";
import {get } from "../users/users-repository";
import { setTokens } from "./set-tokens";

async function validateTokensMiddleware(req, res, next) {
    const refreshToken = req.headers["x-refresh-token"];
    const accessToken = req.headers["x-access-token"];
    if (!accessToken && !refreshToken) return next();

    const decodedAccessToken = validateAccessToken(accessToken);
    if (decodedAccessToken && decodedAccessToken.user) {
        req.user = decodedAccessToken.user;
        return next();
    }

    const decodedRefreshToken = validateRefreshToken(refreshToken);
    if (decodedRefreshToken && decodedRefreshToken.user) {
        // valid refresh token
        const user = await get({ userId: decodedRefreshToken.user.id });
        // valid user and user token not invalidated
        if (!user || user.tokenCount !== decodedRefreshToken.user.count)
            return next();
        req.user = decodedRefreshToken.user;
        // refresh the tokens
        const userTokens = setTokens(user);
        res.set({
            "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
            "x-access-token": userTokens.accessToken,
            "x-refresh-token": userTokens.refreshToken
        });
        return next();
    }
    next();
}