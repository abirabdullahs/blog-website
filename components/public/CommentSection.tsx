'use client';

import { useState, useEffect } from 'react';
import { addComment, getComments } from '@/lib/db/interaction-service';
import { format } from 'date-fns';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

export default function CommentSection({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await getComments(blogId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setFetching(false);
      }
    }
    fetchComments();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addComment(blogId, { name, email, text });
      setText('');
      // Refresh comments
      const data = await getComments(blogId);
      setComments(data);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h3 className="text-[0.7rem] uppercase font-black tracking-[0.3em] border-b border-black pb-2 flex items-center gap-2">
          <MessageSquare size={16} /> Public Dispatches ({comments.length})
        </h3>

        {fetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin opacity-20" size={24} />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-black/10">
            <p className="text-[0.65rem] uppercase font-bold opacity-30 italic">No community feedback yet. Be the first to dispatch.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[0.65rem] font-black uppercase tracking-widest">{comment.name}</span>
                  <span className="text-[0.55rem] uppercase font-bold opacity-30">
                    {comment.createdAt?.seconds ? format(new Date(comment.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Just now'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed opacity-70 italic font-serif">"{comment.text}"</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-2 border-black p-8 bg-white space-y-6">
        <h4 className="text-[0.65rem] uppercase font-black tracking-widest">Leave a Dispatch</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              required 
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-black text-[0.65rem] font-bold uppercase tracking-widest outline-none focus:bg-black/5"
            />
            <input 
              type="email" 
              required 
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-black text-[0.65rem] font-bold uppercase tracking-widest outline-none focus:bg-black/5"
            />
          </div>
          <textarea 
            required 
            placeholder="TYPE YOUR COMMENT HERE..."
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-black text-[0.65rem] font-bold uppercase tracking-widest outline-none focus:bg-black/5 resize-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white text-[0.65rem] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            Submit Dispatch
          </button>
        </form>
      </section>
    </div>
  );
}
