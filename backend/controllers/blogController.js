import Blog from '../models/Blog.js';

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Blog.countDocuments({ ...keyword, status: 'published' });
  const blogs = await Blog.find({ ...keyword, status: 'published' })
    .populate('author', 'name avatar')
    .populate('category', 'name slug')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author', 'name avatar bio')
    .populate('category', 'name slug');

  if (blog) {
    // Increment views
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  const { title, slug, content, excerpt, coverImage, category, tags, status } = req.body;

  const blog = new Blog({
    title,
    slug,
    content,
    excerpt,
    coverImage,
    author: req.user._id,
    category,
    tags,
    status: status || 'draft',
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  const { title, slug, content, excerpt, coverImage, category, tags, status } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    // Check if the user is the author or an admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to edit this blog');
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.coverImage = coverImage || blog.coverImage;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this blog');
    }
    
    await Blog.deleteOne({ _id: blog._id });
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
};

// @desc    Like or unlike a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const likeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    const isLiked = blog.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like
      blog.likes.push(req.user._id);
    }

    await blog.save();
    res.json({ likes: blog.likes });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
};

export {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
};
