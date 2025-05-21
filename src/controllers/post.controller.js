
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title || !description) {
    throw new ApiError(400, "All fields are required")
  }

  const existedPost = await Post.findOne({
    $or: [{ title }, { description }]
  })

  if (existedPost) {
    throw new ApiError(409, "Post with title or description already exists")
  }

  const postImageLocalPath = req.files?.postImage[0]?.path

  if (!postImageLocalPath) {
    throw new ApiError(400, "Post Image  file is required")
  }

  const postImage = await uploadOnCloudinary(postImageLocalPath)

  if (!postImage) {
    throw new ApiError(400, "PostImage is not uploaded on cloudinary")
  }

  const post = await Post.create({
    title, description, postImage: postImage.secure_url, author: req.user?._id
  })

  const createdPost = await Post.findById(post._id)
  if (!createdPost) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdPost, "Post Created Successfully")
  )
})


const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 }); // Optional: latest posts first

  return res.status(200).json(
    new ApiResponse(200, { posts }, "All posts fetched successfully")
  );
});

const getCurrentUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 }); // Optional: latest posts first

  return res.status(200).json(
    new ApiResponse(200, posts, "All posts of the logged-in user")
  );
});

const getPostById = asyncHandler(async (req, res) => {

  const { id } = req.params
  const post = await Post.findById(id).populate("author comment")

  if (!post) {
    throw new ApiError(404, "Post does not exist")
  }

  return res.status(200).json(new ApiResponse(200, { post }, "Post successfully finded"))
})

const getAllCommentsForPost = asyncHandler(async (req, res) => {
  const { postId } = req.params

  if (!postId) {
    throw new ApiError(404, "Post Id not provided")
  }

  const post = await Post.findById(postId)
    .populate({
      path: "comment",
      populate: {
        path: "user",
        select: "fullName avatar", // choose the fields you want
      },
    });
  if (!post) {
    throw new ApiError(404, "Post does not exist")
  }

  return res.status(200).json(new ApiResponse(200, { comments: post.comment }, "All comments fetched successfully"))
})

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const { title, description } = req.body;

  const updateFields = {};

  // Check if title is changed
  if (title?.trim() && title !== post.title) {
    updateFields.title = title;
  }

  // Check if description is changed
  if (description?.trim() && description !== post.description) {
    updateFields.description = description;
  }

  // Check if a new image is uploaded
  const postImageLocalPath = req.file?.path;

  if (postImageLocalPath) {

    const postImage = await uploadOnCloudinary(postImageLocalPath);

    if (!postImage?.secure_url) {
      throw new ApiError(400, "Post image failed to upload");
    }

    if (post.postImage !== postImage.secure_url) {
      updateFields.postImage = postImage.secure_url;
    }
  }

  // 🔁 If nothing actually changed
  if (Object.keys(updateFields).length === 0) {
    return res.status(200).json(
      new ApiResponse(200, post, "No changes detected. Post not updated.")
    );
  }


  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedPost, "Post updated successfully")
  );
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new ApiError(404, "Post not found")
  }
  await Post.findByIdAndDelete(id)

  return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"))
})

export { createPost, getAllPosts, getCurrentUserPosts, getPostById, updatePost, deletePost, getAllCommentsForPost }