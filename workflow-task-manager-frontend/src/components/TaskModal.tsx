import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import AttachmentList from './AttachmentList';
import CommentSection from './CommentSection';
import { attachmentApi } from '../api/attachmentApi';
import toast from 'react-hot-toast';

function TaskModal({ isOpen, onClose, onSubmit, task, setTask, categories, isEdit, refreshTask }: {
  isOpen: boolean; onClose: () => void; onSubmit: (e: React.FormEvent) => any;
  task: any; setTask: (t: any) => void; categories?: any[]; isEdit?: boolean; refreshTask?: () => void;
}): ReactElement | null {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);

  if (!isOpen) return null;

  useEffect(() => {
    if (isEdit && task?.id) loadAttachments(task.id);
  }, [isEdit, task?.id]);

  const loadAttachments = async (taskId: number) => {
    setAttachmentsLoading(true);
    try {
      const response = await attachmentApi.getTaskAttachments(taskId);
      if (response.success) setAttachments(response.data || []);
    } catch (e) { console.error('Failed to load attachments:', e); }
    finally { setAttachmentsLoading(false); }
  };

  const handleUploadSuccess = (newAttachment: any) => {
    setAttachments((prev) => [...prev, newAttachment]);
    toast.success('File uploaded!');
    if (refreshTask) refreshTask();
  };

  const handleDeleteSuccess = (attachmentId: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    toast.success('Attachment deleted!');
    if (refreshTask) refreshTask();
  };

  const handleSubmitWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit) {
      const result = await onSubmit(e);
      if (result?.success && result?.data?.id) {
        setCreatedTaskId(result.data.id);
        setAttachments([]);
        setShowFileUpload(true);
      }
    } else { await onSubmit(e); }
  };

  const shouldShowFileUpload = isEdit || createdTaskId;
  const uploadTaskId = isEdit ? task?.id : createdTaskId;

  const inputCls = "w-full px-4 py-2 bg-white/5 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-white/[0.08] transition";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className={`bg-black border border-white/[0.08] w-full p-6 my-8 max-h-[90vh] overflow-y-auto ${shouldShowFileUpload ? 'max-w-2xl' : 'max-w-md'}`}>
        <h2 className="text-xl font-bold text-white mb-4">
          {isEdit ? 'Edit Task' : createdTaskId ? 'Task Created!' : 'Create New Task'}
        </h2>

        {createdTaskId && (
          <div className="mb-4 p-3 bg-white/5 border border-white/[0.06]">
            <p className="text-slate-300 text-sm">Task created! You can now upload files.</p>
          </div>
        )}

        <form onSubmit={handleSubmitWrapper} className="space-y-4">
          {(!createdTaskId || isEdit) && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
                <input type="text" value={task?.title || ''} onChange={(e) => setTask({ ...task, title: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                <textarea value={task?.description || ''} onChange={(e) => setTask({ ...task, description: e.target.value })} className={inputCls} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {isEdit && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                    <select value={task?.status || 'TODO'} onChange={(e) => setTask({ ...task, status: e.target.value })} className={inputCls}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                  <select value={task?.priority || 'MEDIUM'} onChange={(e) => setTask({ ...task, priority: e.target.value })} className={inputCls}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Due Date</label>
                  <input type="date" value={task?.dueDate || ''} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} className={inputCls} />
                </div>
              </div>
              {categories && categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat: any) => (
                      <button key={cat.id} type="button" onClick={() => { const ids = task?.categoryIds || []; setTask({ ...task, categoryIds: ids.includes(cat.id) ? ids.filter((id: number) => id !== cat.id) : [...ids, cat.id] }); }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${(task?.categoryIds || []).includes(cat.id) ? 'text-white border-transparent' : 'bg-white/5 text-slate-300 border-white/[0.06] hover:bg-white/10'}`}
                        style={{ backgroundColor: (task?.categoryIds || []).includes(cat.id) ? cat.color : undefined }}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {shouldShowFileUpload && uploadTaskId && (
            <div className="border-t border-white/[0.06] pt-4 mt-4">
              <h3 className="text-lg font-semibold text-white mb-4">File Attachments</h3>
              <FileUpload taskId={uploadTaskId} onUploadSuccess={handleUploadSuccess} />
              <div className="mt-4">
                {attachmentsLoading ? (
                  <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /></div>
                ) : (
                  <AttachmentList attachments={attachments} onDelete={handleDeleteSuccess} />
                )}
              </div>
            </div>
          )}

          {isEdit && task?.id && <CommentSection taskId={task.id} />}

          <div className="flex gap-3 pt-4">
            {!createdTaskId && (
              <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 font-medium transition">
                {isEdit ? 'Update Task' : 'Create Task'}
              </button>
            )}
            <button type="button" onClick={() => { setCreatedTaskId(null); setShowFileUpload(false); setAttachments([]); onClose(); }}
              className="flex-1 px-4 py-2 bg-white/5 text-slate-300 font-medium hover:bg-white/10 transition">
              {createdTaskId ? 'Done' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
