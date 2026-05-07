import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, Heart } from 'lucide-react';
import api from '../api/axios';

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Blogs = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data;
    },
  });

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin ring-amber-soft" />
        <p className="text-sm text-text-muted tracking-wide font-medium">Fetching stories…</p>
      </div>
    );
  }

  const blogs = data?.blogs ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-1 max-w-[48px] bg-primary" />
          <span className="text-xs font-medium uppercase tracking-widest text-primary numeric">
            All Stories
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-semibold tracking-tight mb-3 text-text-primary">
          Explore Stories
        </h1>
        <p className="text-lg text-text-muted">
          Discover thinking from creative minds.
        </p>
      </motion.div>

      {/* ── Grid ── */}
      {blogs.length === 0 ? (
        <div className="py-24 text-center glass-card rounded-2xl max-w-2xl mx-auto">
          <p className="text-5xl mb-4 text-primary-hover">✦</p>
          <p className="text-base text-text-muted">No stories yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              custom={index}
              initial="hidden"
              animate="show"
              variants={cardVariants}
              className="group h-full"
            >
              <Link to={`/blog/${blog.slug}`} className="block h-full">
                <div 
                  className="rounded-2xl overflow-hidden h-full flex flex-col bg-surface border border-border transition-all duration-300 hover:border-primary hover:shadow-[0_4px_24px_rgba(217,119,6,0.10)]"
                >
                  {/* Cover image */}
                  <div className="aspect-video w-full overflow-hidden relative bg-surface-2">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-3xl font-semibold tracking-tight text-border-strong transition-transform duration-500 group-hover:scale-105">
                          Blog
                        </span>
                      </div>
                    )}

                    {blog.category?.name && (
                      <span className="absolute top-3 left-3 badge-amber">
                        {blog.category.name}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex-grow flex flex-col">

                    {/* Author + date */}
                    <div className="flex items-center gap-2 mb-4">
                      {blog.author?.avatar ? (
                        <img
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-primary-light text-primary font-display">
                          {blog.author?.name?.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-text-secondary">
                        {blog.author?.name}
                      </span>
                      <span className="text-border-strong">·</span>
                      <span className="text-xs flex items-center gap-1 text-text-muted numeric">
                        <Clock className="w-3 h-3" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-display font-semibold leading-snug mb-2 line-clamp-2 text-text-primary transition-colors duration-150 group-hover:text-primary">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm leading-relaxed line-clamp-3 mb-5 flex-grow text-text-muted">
                      {blog.excerpt}
                    </p>

                    {/* Footer stats */}
                    <div className="flex items-center gap-4 text-xs pt-4 mt-auto border-t border-border text-text-muted numeric">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {(blog.views ?? 0).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        {(blog.likes?.length ?? 0).toLocaleString()}
                      </span>
                      <span className="ml-auto text-xs font-medium text-text-muted group-hover:text-primary transition-colors duration-150">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;