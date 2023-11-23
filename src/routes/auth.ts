import { Router } from "express";
import { ajv } from "app";
import { userSchema } from "@entities/user";
import { login, signup } from "@queries/user";

const router = Router();

router.post("/signup", async function (req, res, next) {
  const validate = ajv.compile(userSchema);
  const user = req.body;
  const valid = validate(user);

  if (!valid) {
    res.send({ result: validate.errors, isError: true });
    console.error(validate.errors);
    return;
  }
  const { result, isError, detail } = await signup(user);

  res.send({ result, isError, detail });
});

router.post("/login", async function (req, res, next) {
  const validate = ajv.compile(userSchema);
  const user = req.body;
  const valid = validate(user);

  if (!valid) {
    res.send({ result: validate.errors, isError: true });
    console.error(validate.errors);
    return; 
  }
  const { result, isError, detail } = await login(user);

  res.send({ result, isError, detail });
});

router.post("/login", async function (req, res, next) {
    const validate = ajv.compile(userSchema);
    const user = req.body;
    const valid = validate(user);
  
    if (!valid) {
      res.send({ result: validate.errors, isError: true });
      console.error(validate.errors);
      return; 
    }
    const { result, isError, detail } = await login(user);
  
    res.send({ result, isError, detail });
  });


  
router.get("/me", async function (req, res, next) {
    const validate = ajv.compile(userSchema);
    const user = req.body;
    const valid = validate(user);
  
    if (!valid) {
      res.send({ result: validate.errors, isError: true });
      console.error(validate.errors);
      return; 
    }
    const { result, isError, detail } = await login(user);
  
    res.send({ result, isError, detail });
});


export default router;
