
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { Post } from "../models/post.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"


const createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title || !description) {
    throw new ApiError(400, "All fields are required")
  }
  // const user = req.user

  // if (!user) {
  //   throw new ApiError(401, "Author not found")
  // }

  // const { fullName, avatar } = await User.findById(user._id)
  // if (!fullName && !avatar) {
  //   throw new ApiError(401, "fullName or avatar is missing from user")
  // }
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
    new ApiResponse(200, posts, "All posts fetched successfully")
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
  const post = await Post.findById(id)

  if (!post) {
    throw new ApiError(404, "Post does not exist")
  }

  return res.status(200).json(new ApiResponse(200, post, "Post successfully finded"))
})


export { createPost, getAllPosts, getCurrentUserPosts, getPostById, updatePost }