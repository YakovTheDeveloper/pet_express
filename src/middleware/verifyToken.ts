import {Request, Response, NextFunction, RequestHandler} from "express";
import {getIdFromToken, validateToken} from "@utils/user";

export const verifyTokenMiddleware: RequestHandler = (req, res, next) => {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) return res.status(401).json({result: "Token missing"});
    const validation = validateToken(token);
    if (!validation) return res.status(401).json({result: "Invalid token"});

    const userId = getIdFromToken(token);

    if (!userId)
        return res
            .status(401)
            .send({detail: "Invalid token (no user id detected)"});

    req.userId = userId
    next();
};

// export const getTokenOrNullMiddleware: RequestHandler = (req, res, next) => {
//     const token = req.headers["authorization"]?.replace("Bearer ", "");
//     req.userId = null
//
//     if (!token) next()
//
//     const validation = validateToken(token);
//     if (!validation) next()
//
//     const userId = getIdFromToken(token);
//     if (!userId) next()
//
//     req.userId = userId
//     next();
// };

export const getUserIdFromToken = (req: Request) => {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    let result: string | null = null

    if (!token) return result

    const validation = validateToken(token);
    if (!validation) return result

    const userId = getIdFromToken(token);
    if (!userId) return result

    result = userId
    return result;
};
