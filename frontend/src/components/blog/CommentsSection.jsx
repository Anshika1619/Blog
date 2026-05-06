import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/useAuthStore';
import Button from '../ui/Button';

const CommentsSection = ({ blogId }) => {
  const [commentText, setCommentText] = useState('');
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: async () => {
      const res = await api.get(`/comments/blog/${blogId}`);
      return res.data;
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      return await api.post('/comments', newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', blogId]);
      setCommentText('');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      return await api.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', blogId]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) return alert("Please login to comment");
    
    addCommentMutation.mutate({ content: commentText, blogId });
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  if (isLoading) return <div className="py-8 text-center text-text-muted">Loading comments...</div>;

  return (
    <div className="mt-16 pt-12 border-t border-white/10" id="comments">
      <h3 className="text-2xl font-serif text-white mb-8">Comments ({comments?.length || 0})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[100px]"
          />
          <div className="absolute bottom-4 right-4">
            <Button 
              type="submit" 
              size="sm" 
              className="rounded-lg gap-2"
              isLoading={addCommentMutation.isLoading}
            >
              <Send className="w-4 h-4" />
              Post
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 glass-card rounded-xl text-center">
          <p className="text-text-muted mb-4">You must be logged in to post a comment.</p>
        </div>
      )}

      <div className="space-y-6">
        {comments?.length === 0 ? (
          <p className="text-center text-text-muted py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments?.map(comment => (
            <div key={comment._id} className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
              <div className="flex-shrink-0">
                {comment.author?.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {comment.author?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{comment.author?.name}</span>
                  <span className="text-xs text-text-muted">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">{comment.content}</p>
              </div>
              
              {(user?.role === 'admin' || user?._id === comment.author?._id) && (
                <button 
                  onClick={() => handleDelete(comment._id)}
                  className="self-start text-text-muted hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
