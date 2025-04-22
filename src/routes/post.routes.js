import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createPost, deletePost, getAllPosts, getCurrentUserPosts, getPostById, updatePost } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router()

router.route('/create-post').post(upload.fields([{ name: 'postImage', maxCount: 1 }]), verifyJWT, createPost)

router.route('/get-posts').get(getAllPosts)

router.route('/get-user-posts').get(verifyJWT, getCurrentUserPosts)

router.route('/getPostById/:id').get(getPostById)

router.route('/update-post/:id')
  .patch(verifyJWT, upload.fields([{ name: 'postImage', maxCount: 1 }]), updatePost);

router.route('/:id').delete(verifyJWT, deletePost)

export default router