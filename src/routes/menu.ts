import { Router } from "express";
import { ajv } from "app";
import { verifyTokenMiddleware } from "@middleware/verifyToken";
import { menuSchema, menuSchemaUpdate } from "@entities/menu";
import { createMenu, getMenu, patchMenu } from "@queries/menu";

const menuRouter = Router();
menuRouter.use(verifyTokenMiddleware);

menuRouter.get("/", async function (req, res, next) {
  const userId = req.userId

  const result = await getMenu(userId);

  res.send(result);
});

menuRouter.post("/", async function (req, res, next) {
    const userId = req.userId

  const validate = ajv.compile(menuSchema);
  const menu = req.body;
  const valid = validate(menu);

  if (!valid) {
    res.send({ result: validate.errors, isError: true });
    console.error(validate.errors);
    return;
  }

  const result = await createMenu(menu, userId);

  res.send(result);
  // res.send({ result, isError, detail });
});

menuRouter.patch("/:id", async function (req, res, next) {
    const userId = req.userId


  const validate = ajv.compile(menuSchemaUpdate);
  const menu = req.body;
  const valid = validate(menu);

  if (!valid) {
    res.send({ result: validate.errors, isError: true });
    console.error(validate.errors);
    return;
  }

  const result = await patchMenu(req.params.id, menu);
  res.send(result);
  // res.send({ result, isError, detail });
});

export default menuRouter;
