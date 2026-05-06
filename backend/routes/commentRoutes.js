import express from 'express';
import {
  getCommentsByBlog,
  addComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addComment);

router.route('/blog/:blogId')
  .get(getCommentsByBlog);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
