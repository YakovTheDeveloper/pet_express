import Ajv from "ajv/dist/jtd";
import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { Request } from "express";
import cors from "cors";
import authRouter from "../routes/auth";
import productsRouter from "../routes/products";
import indexRouter from "../routes/index";
import userRouter from "../routes/user";
import menuRouter from "@routes/menu";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import responseWrapper from "@middleware/responseWrapper";
import nutrientsRouter from "routes/nutrients";
import normRouter from "routes/norm";
import {verifyTokenMiddleware} from "middleware/verifyToken";

// const ___filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(___filename);

export const ajv = new Ajv();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));


// todo error handling to prevent app crash

app.post('*', verifyTokenMiddleware)
app.delete('*', verifyTokenMiddleware)
app.patch('*', verifyTokenMiddleware)

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/menu", menuRouter);
app.use("/user", userRouter);
app.use("/nutrients", nutrientsRouter);
app.use("/norms", normRouter);
app.use(responseWrapper);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //   res.render("error");
  res.send("sorry");
});

export default app;
