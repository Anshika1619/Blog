import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Users, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/ui/Button';

const StatCard = ({ icon: Icon, title, value, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    className="glass-card p-6 rounded-2xl flex items-center gap-5"
  >
    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary shadow-sm border border-[#FDE68A]">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-text-muted text-sm font-medium">{title}</p>
      <p className="text-3xl font-semibold text-text-primary numeric mt-0.5">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['userBlogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs');
      return data.blogs.filter(blog => blog.author?._id === user?._id);
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userBlogs']);
    }
  });

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin ring-amber-soft" />
        <p className="text-sm text-text-muted tracking-wide font-medium">Loading your dashboard…</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteBlogMutation.mutate(id);
    }
  };

  const totalViews = blogs?.reduce((acc, blog) => acc + (blog.views || 0), 0) || 0;
  const totalLikes = blogs?.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0) || 0;
  const avgViews = blogs?.length ? Math.round(totalViews / blogs.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* ── Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
      >
        <div>
          <h1 className="text-4xl font-display font-semibold text-text-primary mb-2 tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-lg text-text-muted">Here's what's happening with your content today.</p>
        </div>
        <Link to="/write">
          <Button className="gap-2 shadow-sm">
            <Edit className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <StatCard icon={FileText} title="Total Posts" value={blogs?.length || 0} delay={0.05} />
        <StatCard icon={Eye} title="Total Views" value={totalViews.toLocaleString()} delay={0.1} />
        <StatCard icon={Users} title="Total Likes" value={totalLikes.toLocaleString()} delay={0.15} />
        <StatCard icon={BarChart} title="Avg. Views/Post" value={avgViews.toLocaleString()} delay={0.2} />
      </div>

      {/* ── Recent Posts List ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border bg-surface-1">
          <h2 className="text-xl font-display font-semibold text-text-primary">Recent Posts</h2>
        </div>
        
        {blogs?.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-5xl mb-4 text-border-strong">✦</p>
            <p className="text-text-muted text-lg mb-4">You haven't written any posts yet.</p>
            <Link to="/write" className="text-primary font-medium hover:text-primary-hover hover:underline transition-colors">
              Start writing now →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {blogs?.slice(0, 5).map((blog) => (
              <div 
                key={blog._id} 
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-2 transition-colors duration-200 group"
              >
                <div>
                  <Link to={`/blog/${blog.slug || blog._id}`}>
                    <h3 className="text-lg font-display font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                      {blog.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted numeric">
                    <span className="flex items-center gap-1.5">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border-strong" />
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {blog.views?.toLocaleString() || 0}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border-strong" />
                    <span className={
                      blog.status === 'published' 
                        ? 'badge-amber capitalize' 
                        : 'text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-2 text-text-muted border border-border capitalize'
                    }>
                      {blog.status || 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <Link to={`/edit/${blog._id}`}>
                    <Button variant="ghost" size="sm" className="text-text-muted hover:text-primary hover:bg-primary-light">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(blog._id)} 
                    disabled={deleteBlogMutation.isLoading} 
                    className="text-text-muted hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;