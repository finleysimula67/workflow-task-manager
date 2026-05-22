import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { commentApi } from '../api/commentApi';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

function CommentSection({ taskId }: { taskId: number }): ReactElement {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = authApi.getCurrentUser();

  useEffect(() => { loadComments(); }, [taskId]);

  const loadComments = async () => {
    try {
      const res = await commentApi.getTaskComments(taskId);
      if (res.success) setComments(res.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentApi.addComment(taskId, newComment);
      if (res.success) { setNewComment(''); loadComments(); toast.success('Comment added'); }
    } catch (err: any) { toast.error(err.message || 'Failed to add comment'); }
    finally { setSubmitting(false); }
  };

  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      const res = await commentApi.updateComment(commentId, editContent);
      if (res.success) { setEditingId(null); setEditContent(''); loadComments(); }
    } catch (err: any) { toast.error(err.message || 'Failed to update'); }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await commentApi.deleteComment(commentId);
      if (res.success) { loadComments(); toast.success('Comment deleted'); }
    } catch (err: any) { toast.error(err.message || 'Failed to delete'); }
  };

  const handleStartEdit = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  if (loading) return <div className="text-center py-4 text-slate-500">Loading comments...</div>;

  const inputCls = "w-full px-3 py-2 rounded-xl border bg-black/40 text-white placeholder-slate-500 focus:ring-2 focus:ring-white/20 focus:border-transparent transition border-white/[0.06]";

  return (
    <div className="border-t-2 border-white/[0.06] pt-4 mt-4">
      <h3 className="text-lg font-semibold text-white mb-4">Comments ({comments.length})</h3>

      <form onSubmit={handleAdd} className="mb-4">
        <div className="flex gap-2">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className={inputCls} rows={2} disabled={submitting} />
          <button type="submit" disabled={submitting || !newComment.trim()}
            className="self-end p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 transition h-fit">
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="bg-black/40 border border-white/[0.06] rounded-xl p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-white">{comment.username}</span>
                  <span className="text-xs text-slate-500 ml-2">{new Date(comment.createdAt).toLocaleString()}{comment.isEdited && ' (edited)'}</span>
                </div>
                {comment.userId === currentUser?.id && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStartEdit(comment)} className="text-slate-400 hover:underline text-sm">Edit</button>
                    <button onClick={() => handleDelete(comment.id)} className="text-slate-400 hover:underline text-sm">Delete</button>
                  </div>
                )}
              </div>
              {editingId === comment.id ? (
                <div>
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className={inputCls} rows={2} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleUpdate(comment.id)} className="px-3 py-1 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm transition">Save</button>
                    <button onClick={() => { setEditingId(null); setEditContent(''); }} className="px-3 py-1 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 text-sm transition">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 whitespace-pre-wrap">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
