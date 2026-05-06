import Comment from '../models/Comment.js';

// @desc    Get comments for a blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
const getCommentsByBlog = async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(comments);
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  const { content, blogId, parentCommentId } = req.body;

  const comment = new Comment({
    content,
    author: req.user._id,
    blog: blogId,
    parentComment: parentCommentId || null,
  });

  const createdComment = await comment.save();
  res.status(201).json(createdComment);
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this comment');
    }
    
    // In a real scenario, you might want to also delete child comments
    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
};

export { getCommentsByBlog, addComment, deleteComment };
