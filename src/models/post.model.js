import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)