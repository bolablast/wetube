import express from "express";
import {
  getEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
