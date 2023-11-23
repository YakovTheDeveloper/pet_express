import {
    getProductWithNutrients,
    getProducts,
    getProductsMinimalData, getRichProducts, createProduct, deleteProduct, patchProduct, patchProductNutrients,
} from "@queries/products";
import {ErrorResponse, Response, SuccessResponse} from "@utils/response";
import {Router} from "express";
import {createPayloadValidationMiddleware} from "utils/validate";
import {productSchemaCreate, productSchemaUpdate} from "entities/product";
import {userIdMiddleware} from "middleware/userIdMiddleware";
import {getTokenOrNullMiddleware, getUserIdFromToken, verifyTokenMiddleware} from "middleware/verifyToken";
import {deleteNorm} from "queries/norm";
import normRouter from "routes/norm";

var router = Router();

// router.post('*', verifyTokenMiddleware)
// router.delete('*', verifyTokenMiddleware)

// check user id
// если есть

router.post('*', createPayloadValidationMiddleware(productSchemaCreate))
router.patch('*', createPayloadValidationMiddleware(productSchemaUpdate))

router.post("/", async function ({userId, body}, res, next) {
    const response = await createProduct(userId!, body)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));

    // console.log(result)
    res.send(response);
});

router.delete("/:id", async function ({userId, params}, res, next) {
    const response = await deleteProduct(userId!, params.id)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));
    res.send(response);
});

router.patch("/:id", async function ({userId, params, body}, res, next) {
    const nutrientsData = patchProductNutrients(userId!, params.id, body)

    const productData = patchProduct(userId!, params.id, body)

    const result = await Promise.all([nutrientsData, productData])
        .then(([nutrients, product]) => SuccessResponse({
            product,
            nutrients
        }))
        .catch((err) => ErrorResponse(err.message))


    // .catch((err) => ErrorResponse(err.message));   const response = await patchProductNutrients(userId!, params.id, body)
    // .then((result) => SuccessResponse(result))
    // .catch((err) => ErrorResponse(err.message));
    res.send(result);
});

router.get("/names", async function (req, res, next) {
    const response = await getProducts()
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));

    // console.log(result)
    res.send(response);
});

router.get("/minimal/", async function (req, res, next) {
    const {name, category, state} = req.query;
    const cleanParams = {} as any;

    if (name) cleanParams.name = name;
    if (category) cleanParams.category = category;
    if (state) cleanParams.state = state;
    //   const result = await getProductsMinimalData(cleanParams)

    const response = await getProductsMinimalData(cleanParams)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));

    // console.log(result)
    res.send(response);
});

router.get("/with_nutrients/", async function (req, res, next) {
    const {food_id} = req.query;
    const cleanParams = {} as any;

    if (food_id) cleanParams.foodId = food_id;

    const response = await getProductWithNutrients(cleanParams)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));

    // console.log(result)
    res.send(response);
});

router.get("/rich/", async function (req, res, next) {
    const userId = getUserIdFromToken(req)

    const {nutrient_id} = req.query;
    if (!('nutrient_id' in req.query)) {
        res.send(ErrorResponse('Wrong parameter name'));
    }
    const cleanParams = {} as any;

    if (nutrient_id) cleanParams.nutrientId = nutrient_id;

    const response = await getRichProducts(cleanParams, userId)
        .then((result) => SuccessResponse(result))
        .catch((err) => ErrorResponse(err.message));
    res.send(response);
});


export default router;
