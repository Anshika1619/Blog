import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { Bold, Italic, List, ListOrdered, Quote, Code, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import Button from '../components/ui/Button';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const btnClass = "p-2 rounded-lg text-text-muted hover:bg-surface-2 hover:text-text-primary transition-all duration-150";
  const activeClass = "bg-primary-light text-primary hover:bg-primary-light ring-1 ring-[#FDE68A]";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border pb-4 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''} font-display font-bold text-sm px-3`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${btnClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''} font-display font-bold text-sm px-3`}
      >
        H3
      </button>

      <div className="w-px h-6 bg-border mx-2" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btnClass} ${editor.isActive('blockquote') ? activeClass : ''}`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${btnClass} ${editor.isActive('codeBlock') ? activeClass : ''}`}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
};

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['userBlogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs');
      return data.blogs;
    }
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        // Removed prose-invert so it uses your global .ProseMirror classes!
        class: 'focus:outline-none min-h-[500px]',
      },
    },
  });

  useEffect(() => {
    if (blogs && editor) {
      const blogToEdit = blogs.find(b => b._id === id);
      if (blogToEdit) {
        setTitle(blogToEdit.title);
        if (editor.isEmpty) {
          editor.commands.setContent(blogToEdit.content);
        }
      }
    }
  }, [blogs, id, editor]);

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-40 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin ring-amber-soft" />
        <p className="text-sm text-text-muted tracking-wide font-medium">Loading editor…</p>
      </div>
    );
  }

  const handleUpdate = async (status = 'published') => {
    if (!title) return alert('Title is required');
    if (!editor) return;

    try {
      setIsSubmitting(true);
      const content = editor.getHTML();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      
      await api.put(`/blogs/${id}`, {
        title,
        slug,
        content,
        status,
        excerpt: editor.getText().substring(0, 150) + '...',
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* ── Top Action Bar ── */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-text-muted uppercase tracking-widest numeric">Editing Post</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={() => handleUpdate('draft')}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button 
            onClick={() => handleUpdate('published')}
            disabled={isSubmitting}
            className="gap-2 shadow-sm"
          >
            <Check className="w-4 h-4" />
            Update & Publish
          </Button>
        </div>
      </div>

      {/* ── Title Input ── */}
      <input
        type="text"
        placeholder="Blog Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent text-4xl sm:text-5xl font-display font-semibold text-text-primary placeholder:text-border-strong focus:outline-none mb-8 resize-none tracking-tight"
      />

      {/* ── Editor Canvas ── */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EditBlog;