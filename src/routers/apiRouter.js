import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  editComment,
  likeUp,
  likeDown,
  dislikeUp,
  dislikeDown,
} from "../controllers/videoController";
import {
  commentLikeUp,
  commentLikeDown,
  commentDislikeUp,
  commentDislikeDown,
} from "../controllers/commentController";
import { commentProtector } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete",
  commentProtector,
  deleteComment
);
apiRouter.post(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/edit",
  commentProtector,
  editComment
);
apiRouter.post(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/like/up",
  commentLikeUp
);
apiRouter.post(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/like/down",
  commentLikeDown
);
apiRouter.post(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/dislike/up",
  commentDislikeUp
);
apiRouter.post(
  "/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/dislike/down",
  commentDislikeDown
);
apiRouter.post("/videos/:videoId([0-9a-f]{24})/like/up", likeUp);
apiRouter.post("/videos/:videoId([0-9a-f]{24})/like/down", likeDown);
apiRouter.post("/videos/:videoId([0-9a-f]{24})/dislike/up", dislikeUp);
apiRouter.post("/videos/:videoId([0-9a-f]{24})/dislike/down", dislikeDown);
export default apiRouter;
