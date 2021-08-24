import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";
import { home, search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(protectorMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(protectorMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
