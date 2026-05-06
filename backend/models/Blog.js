import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String, // Rich text content (HTML from TipTap)
    required: true,
  },
  excerpt: {
    type: String,
  },
  coverImage: {
    type: String, // URL/path to the image
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [{
    type: String,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
}, {
  timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
