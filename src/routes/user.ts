import {Router} from "express";
import {ajv} from "app";
import {userSchema} from "@entities/user";
import {getMe, getUserProducts, login, signup} from "@queries/user";
import {getUserIdFromToken, verifyTokenMiddleware} from "@middleware/verifyToken";
import {ErrorResponse, SuccessResponse} from "@utils/response";

const router = Router();

router.use(verifyTokenMiddleware);
router.get("/me", async function (req, res, next) {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    const response = await getMe(token || "")
        .then((r) => SuccessResponse(r))
        .catch((r) => ErrorResponse(r));
    res.send(response);
});

router.get("/products", async function (req, res, next) {
    const response = await getUserProducts(req.userId!)
        .then((r) => SuccessResponse(r))
        .catch((r) => ErrorResponse(r));
    res.send(response);
});


export default router;
