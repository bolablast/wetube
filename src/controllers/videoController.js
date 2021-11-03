import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

const simple = (ms) => {
  if (ms > 1000 && ms < 1000 * 60) {
    return `${Math.floor(ms / 1000)}초 전`; // 초
  } else if (ms > 1000 * 60 && ms < 1000 * 60 * 60) {
    return `${Math.floor(ms / 1000 / 60)}분 전`; // 분
  } else if (ms > 1000 * 60 * 60 && ms < 1000 * 60 * 60 * 24) {
    return `${Math.floor(ms / 1000 / 60 / 60)}시간 전`; // 시간
  } else if (ms > 1000 * 60 * 60 * 24 && ms < 1000 * 60 * 60 * 24 * 7) {
    return `${Math.floor(ms / 1000 / 60 / 60 / 24)}일 전`; // 일
  } else if (ms > 1000 * 60 * 60 * 24 * 7 && ms < 1000 * 60 * 60 * 24 * 7 * 4) {
    return `${Math.floor(ms / 1000 / 60 / 60 / 24 / 7)}주 전`; //주
  } else if (
    ms > 1000 * 60 * 60 * 24 * 7 * 4 &&
    ms < 1000 * 60 * 60 * 24 * 7 * 4 * 12
  ) {
    return `${Math.floor(ms / 1000 / 60 / 60 / 24 / 7 / 4)}달 전`; // 달
  } else if (
    ms > 1000 * 60 * 60 * 24 * 7 * 4 * 12 &&
    ms < 1000 * 60 * 60 * 24 * 7 * 4 * 12 * 100
  ) {
    return `${Math.floor(ms / 1000 / 60 / 60 / 24 / 7 / 4 / 12)}년 전`; // 년
  } else {
    return `방금 전`; // 버그방지
  }
};

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  videos.forEach((item) => {
    item.timeString = simple(new Date() - new Date(item.createdAt));
  });
  videos.forEach((item) => {
    item.save();
  });
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  const date = new Date();
  video.comments.forEach((item) => {
    item.beforeTime = date - new Date(item.createdAt);
    item.timeString = simple(item.beforeTime);
  });
  video.save();
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.session.user = user;
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  const user = await User.findById(_id);
  user.videos = user.videos.filter((item) => item !== id);
  user.save();
  req.session.user = user;
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const users = await User.findById(user._id).populate("comments");
  const comment = await Comment.create({
    avatarUrl: user.avatarUrl,
    username: user.username,
    text,
    owner: user._id,
    video: id,
  });
  const video = await Video.findById(id).populate("comments");
  if (!video) {
    return res.sendStatus(404);
  }
  video.comments.push(comment._id);
  video.save();
  await Comment.findById(comment._id).populate("video").populate("owner");
  users.comments.push(comment._id);
  users.save();
  req.session.user = users;
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { commentId, videoId },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(videoId);
  const user = await User.findById(_id);
  user.comments = user.comments.filter((item) => String(item) !== commentId);
  user.save();
  req.session.user = user;
  video.comments = video.comments.filter((item) => String(item) !== commentId);
  video.save();
  await Comment.findByIdAndDelete(commentId);
  return res.sendStatus(200);
};

export const editComment = async (req, res) => {
  const {
    body: { value },
    params: { commentId },
  } = req;
  await Comment.findByIdAndUpdate(commentId, {
    text: value,
    edited: true,
  });
};

export const likeUp = async (req, res) => {
  const {
    params: { videoId },
    session: { user },
  } = req;
  if (user == null) {
    return res.sendStatus(400);
  }
  const video = await Video.findById(videoId);
  const users = await User.findById(user._id);
  if (users.likeVideo.map((item) => String(item)).includes(String(video._id))) {
    return res.sendStatus(400);
  }
  users.likeVideo.push(video._id);
  video.like = video.like + 1;
  video.save();
  users.save();
  req.session.user = users;
  return res.sendStatus(200);
};

export const likeDown = async (req, res) => {
  const {
    params: { videoId },
    session: { user },
  } = req;
  if (user == null) {
    return res.sendStatus(200);
  }
  const video = await Video.findById(videoId);
  const users = await User.findById(user._id);
  if (
    !users.likeVideo.map((item) => String(item)).includes(String(video._id))
  ) {
    return res.sendStatus(400);
  }
  users.likeVideo = users.likeVideo.filter((item) => {
    String(item) !== String(videoId);
  });
  video.like = video.like - 1;
  video.save();
  users.save();
  req.session.user = users;
  return res.sendStatus(200);
};

export const dislikeUp = async (req, res) => {
  const {
    params: { videoId },
    session: { user },
  } = req;
  if (user == null) {
    return res.sendStatus(200);
  }
  const video = await Video.findById(videoId);
  const users = await User.findById(user._id);
  if (
    users.dislikeVideo.map((item) => String(item)).includes(String(video._id))
  ) {
    return res.sendStatus(400);
  }
  users.dislikeVideo.push(String(videoId));
  video.dislike = video.dislike + 1;
  video.save();
  users.save();
  req.session.user = users;
  return res.sendStatus(200);
};

export const dislikeDown = async (req, res) => {
  const {
    params: { videoId },
    session: { user },
  } = req;
  if (user == null) {
    return res.sendStatus(200);
  }
  const video = await Video.findById(videoId);
  const users = await User.findById(user._id);
  if (
    !users.dislikeVideo.map((item) => String(item)).includes(String(video._id))
  ) {
    return res.sendStatus(400);
  }
  users.dislikeVideo = users.dislikeVideo.filter(
    (item) => String(item) !== String(videoId)
  );
  video.dislike = video.dislike - 1;
  video.save();
  users.save();
  req.session.user = users;
  return res.sendStatus(200);
};
