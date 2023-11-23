import {Router} from "express";
import {getMenu} from "queries/menu";
import {getNutrients} from "queries/nutrients";
import {getProductWithNutrients} from "queries/products";
import {ErrorResponse, SuccessResponse} from "utils/response";

const nutrientsRouter = Router();

nutrientsRouter.get("/", async function ({query}, res, next) {
    const {have_norms} = query;
    const cleanParams = {} as any;

    if (have_norms) cleanParams.haveNorms = have_norms;

    const response = await getNutrients(cleanParams)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));
    res.send(response);
});

export default nutrientsRouter
