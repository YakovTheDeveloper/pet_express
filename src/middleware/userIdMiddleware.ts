import {RequestHandler} from "express";


export const userIdMiddleware: RequestHandler = (req, res, next) => {
    const userId = req.query["userId"]?.toString();
    if (!userId)
        return res
            .status(401)
            .send({detail: "Invalid token (no user id detected)"});
    return next()
}

