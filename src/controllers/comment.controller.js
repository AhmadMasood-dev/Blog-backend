import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { Comment } from "../models/comment.model.js"
import { Post } from "../models/post.model.js"

const createComment = asyncHandler(async (req, res) => {

  const { postId } = req.params
  const userId = req.user?._id;

  if (!postId) {
    throw new ApiError(404, "postId not found")
  }
  const post = await Post.findById(postId)
  if (!post) {
    throw new ApiError(401, "User not found for comment")
  }

  const { commentIs } = req.body

  if (!commentIs?.trim()) {
    throw new ApiError(401, "Comment field is required")
  }
  const existedComment = await Comment.findOne({
    $or: [{ commentIs }]
  })

  if (existedComment) {
    throw new ApiError(401, "Comment is already given on this post")
  }

  const comment = await Comment.create({
    commentIs,
    user: userId,
    post: postId
  })

  post.comment.push(comment._id);
  await post.save();
  // Populate the user field
  await comment.populate("user", "fullName avatar");


  return res.status(200).json(new ApiResponse(200, { comment }, "Comment successfull added"))
})

const getAllComments = asyncHandler(async (req, res) => {

  const comments = await Comment.find().populate('post');


  if (!comments || comments.length === 0) {
    throw new ApiError(404, "No comments found");
  }


  return res.status(200).json({
    status: "success",
    data: comments,
  });
});

const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params


  if (!commentId) {
    throw new ApiError(403, "ID not found")
  }

  const comment = await Comment.findById(commentId).populate('user').populate('post');

  if (comment) {
    throw new ApiError(404, "comment was not found")
  }
  return res.status(200).json(new ApiResponse(200, comment, "Comment Found"))
})

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  if (!commentId) {
    throw new ApiError(401, "comment not found")
  }
  const { commentIs } = req.body

  if (!commentIs) {
    throw new ApiError(401, "updated comment not found")
  }

  const updatedComment = await Comment.findByIdAndUpdate(commentId, { $set: { commentIs: commentIs } }, { new: true })

  return res.status(200).json(
    new ApiResponse(200, updatedComment, "comment updated successfully")
  );

})

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  console.log("commentId", commentId)
  if (!commentId) {
    throw new ApiError(401, "Comment Id not found ")
  }
  await Comment.findByIdAndDelete(commentId)

  return res.status(200).json(new ApiResponse(200, {}, "Successfully deleted"))

})
export { createComment, getAllComments, getCommentById, updateComment, deleteComment }