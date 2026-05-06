import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, MessageSquare, Share2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import CommentsSection from '../components/blog/CommentsSection';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } 
  }),
};

const BlogDetails = () => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    }
  });

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-40 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin ring-amber-soft" />
        <p className="text-sm text-text-muted tracking-wide font-medium">Loading story…</p>
      </div>
    );
  }

  /* ── Not Found State ── */
  if (!blog) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 mt-20 text-center glass-card rounded-2xl">
        <p className="text-6xl mb-6 text-primary-hover">✦</p>
        <h1 className="text-3xl font-display font-semibold text-text-primary mb-3">Story not found</h1>
        <p className="text-text-muted">This story doesn't exist or may have been removed.</p>
      </div>
    );
  }

  const isLiked = isAuthenticated && blog.likes.includes(user?._id);

  const handleLike = async () => {
    if (!isAuthenticated) return alert('Please login to like this post');
    try {
      await api.put(`/blogs/${blog._id}/like`);
      queryClient.invalidateQueries(['blog', slug]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* ── Header ── */}
      <header className="mb-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >

          {/* Category + Date */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="flex items-center gap-3 mb-7"
          >
            <span className="badge-amber uppercase">
              {blog.category?.name || 'Uncategorized'}
            </span>
            <span className="text-text-muted text-sm numeric">
              {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            custom={0.05}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-text-primary leading-[1.15] tracking-tight mb-8"
          >
            {blog.title}
          </motion.h1>

          {/* Author bar */}
          <motion.div
            variants={fadeUp}
            custom={0.1}
            className="flex items-center justify-between py-5 border-y border-border"
          >
            {/* Author info */}
            <div className="flex items-center gap-3">
              {blog.author?.avatar ? (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-semibold bg-primary-light text-primary font-display">
                  {blog.author?.name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-text-primary leading-tight">{blog.author?.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{blog.author?.bio || 'Author at Antigravity'}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 hover:bg-surface-2 ${
                  isLiked ? 'text-secondary' : 'text-text-muted'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform group-hover:scale-110 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-muted transition-all duration-150 hover:bg-surface-2"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-muted transition-all duration-150 hover:bg-surface-2"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* ── Cover Image ── */}
      {blog.coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 aspect-[21/9] rounded-2xl overflow-hidden glass-card shadow-sm p-1"
        >
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover rounded-xl"
          />
        </motion.div>
      )}

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="prose prose-lg max-w-none
          prose-headings:font-display prose-headings:font-semibold prose-headings:text-text-primary prose-headings:tracking-tight
          prose-p:text-text-secondary prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-primary prose-blockquote:text-text-muted prose-blockquote:bg-primary-subtle prose-blockquote:rounded-r-md
          prose-strong:text-text-primary
          prose-code:text-primary-hover prose-code:bg-surface-2
          prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border"
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {blog.tags?.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 bg-surface text-text-muted border border-border hover:bg-primary-light hover:text-primary-hover hover:border-primary cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-text-muted numeric">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {blog.views.toLocaleString()}
          </span>
          <span className="w-px h-3 rounded bg-border-strong" />
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            {blog.likes.length.toLocaleString()}
          </span>
        </div>
      </motion.footer>

      {/* ── Comments ── */}
      <CommentsSection blogId={blog._id} />
    </article>
  );
};

export default BlogDetails;