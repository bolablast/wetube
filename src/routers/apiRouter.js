import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  editComment,
} from "../controllers/videoController";
import { commentProtector } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.get(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete",
  commentProtector,
  deleteComment
);
apiRouter.post(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/edit",
  commentProtector,
  editComment
);
export default apiRouter;
