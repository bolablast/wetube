import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  avatarUrl: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, requried: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
  beforeTime: { type: Number, default: 0 },
  timeString: { type: String, default: "방금 전" },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  likeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  edited: { type: Boolean, default: false },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
