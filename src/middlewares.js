import multer from "multer";
import Comment from "./models/Comment";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.render("/");
  }
};

export const commentProtector = async (req, res, next) => {
  const {
    params: { commentId },
  } = req;
  const comment = await Comment.findById(commentId).populate("owner");
  if (String(req.session.user._id) !== String(comment.owner._id)) {
    req.flash("bad", "You are not owner of this comment");
    return res.sendStatus(400);
  }
  next();
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});
