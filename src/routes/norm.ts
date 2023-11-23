import {RequestHandler, Router} from "express";
import {ajv} from "app";
import {verifyTokenMiddleware} from "@middleware/verifyToken";
import {menuSchema, menuSchemaUpdate} from "@entities/menu";
import {createMenu, getMenu, patchMenu} from "@queries/menu";
import {createNorm, deleteNorm, getNorm, updateNorm} from "queries/norm";
import {ErrorResponse, SuccessResponse} from "utils/response";
import {createPayloadValidationMiddleware} from "utils/validate";
import {normSchemaCreate, normSchemaUpdate} from "entities/norm";
import {userIdMiddleware} from "middleware/userIdMiddleware";

const normRouter = Router();
normRouter.use(verifyTokenMiddleware);
// normRouter.use(userIdMiddleware)
normRouter.post('*', createPayloadValidationMiddleware(normSchemaCreate))
normRouter.patch('*', createPayloadValidationMiddleware(normSchemaUpdate))

normRouter.get("/", async function ({userId}, res, next) {
    const result = await getNorm(userId!)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));
    res.send(result);
});

normRouter.post("/", async function ({userId, body}, res, next) {
    const result = await createNorm(userId, body)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));
    res.send(result);
});

normRouter.patch("/:id", async function ({userId, params, body}, res, next) {
    const result = await updateNorm(userId!, params.id, body);
    res.send(result);
});

normRouter.delete("/:id", async function ({userId, params}, res, next) {
    const result = await deleteNorm(userId!, params.id)
        .then((result) => SuccessResponse(true))
        .catch((err) => ErrorResponse(err.message));
    res.send(result);
});

export default normRouter;
