import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getAllComments, getCommentById, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route('/:postId').post(verifyJWT, createComment)

router.route('/').get(getAllComments)

router.route('/:commentId').get(getCommentById)

router.route('/update-comment/:commentId').post(verifyJWT, updateComment)

router.route('/:commentId').delete(verifyJWT, deleteComment)



export default router