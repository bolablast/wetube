import Comment from "../models/Comment";
import User from "../models/User";
/*
comment.likeUser = [];
user.likeComments = [];
comment.like = 0;
*/
export const commentLikeUp = async (req, res) => {
  const {
    params: { commentId },
    session: {
      user: { _id },
    },
  } = req;
  if (req.session.user == null) {
    return res.sendStatus(200);
  }
  const user = await User.findById(_id);
  const comment = await Comment.findById(commentId);
  if (comment.likeUser.map((item) => String(item)).includes(String(_id))) {
    return res.sendStatus(400);
  }
  user.likeComments.push(commentId);
  comment.likeUser.push(_id);
  comment.like = comment.like + 1;
  user.save();
  comment.save();
  return res.sendStatus(200);
};
export const commentLikeDown = async (req, res) => {
  const {
    params: { commentId },
    session: {
      user: { _id },
    },
  } = req;
  if (req.session.user == null) {
    return res.sendStatus(200);
  }
  const user = await User.findById(_id);
  const comment = await Comment.findById(commentId);
  if (!comment.likeUser.map((item) => String(item)).includes(String(_id))) {
    return res.sendStatus(400);
  }
  user.likeComments = user.likeComments.filter(
    (item) => String(item) !== String(commentId)
  );
  comment.likeUser = comment.likeUser.filter(
    (item) => String(item) !== String(_id)
  );
  comment.like = comment.like - 1;
  user.save();
  comment.save();
  return res.sendStatus(200);
};
export const commentDislikeUp = async (req, res) => {
  const {
    params: { commentId },
    session: {
      user: { _id },
    },
  } = req;
  if (req.session.user == null) {
    return res.sendStatus(200);
  }
  const user = await User.findById(_id);
  const comment = await Comment.findById(commentId);
  if (comment.dislikeUser.map((item) => String(item)).includes(String(_id))) {
    return res.sendStatus(400);
  }
  user.dislikeComments.push(commentId);
  comment.dislikeUser.push(_id);
  comment.dislike = comment.dislike + 1;
  user.save();
  comment.save();
  return res.sendStatus(200);
};
export const commentDislikeDown = async (req, res) => {
  const {
    params: { commentId },
    session: {
      user: { _id },
    },
  } = req;
  if (req.session.user == null) {
    return res.sendStatus(200);
  }
  const user = await User.findById(_id);
  const comment = await Comment.findById(commentId);
  if (!comment.dislikeUser.map((item) => String(item)).includes(String(_id))) {
    return res.sendStatus(400);
  }
  user.dislikeComments = user.dislikeComments.filter(
    (item) => String(item) !== String(commentId)
  );
  comment.dislikeUser = comment.dislikeUser.filter(
    (item) => String(item) !== String(_id)
  );
  comment.dislike = comment.dislike - 1;
  user.save();
  comment.save();
  return res.sendStatus(200);
};
