import mongoose from "mongoose";

export const formatHashtags = (hashtags) =>
  hashtags.split(",").map((word) => (word.startWith("#") ? word : `#${word}`));

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 2 },
  createdAt: { type: Date, required: true, default: Date.now },
  timeString: { type: String, default: "방금 전" },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

videoSchema.static("changePathFormula", (urlPath) => {
  return urlPath.replace(/\\/g, "/");
});
const Video = mongoose.model("Video", videoSchema);
export default Video;
