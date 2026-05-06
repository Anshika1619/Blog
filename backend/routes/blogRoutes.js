import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} from '../controllers/blogController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like')
  .put(protect, likeBlog);

export default router;
