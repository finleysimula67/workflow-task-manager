import type { ReactElement } from 'react';
import { useState } from 'react';
import FileUpload from './FileUpload';
import AttachmentList from './AttachmentList';
import CommentSection from './CommentSection';

function TaskModal({ isOpen, onClose, onSubmit, task, setTask, categories, isEdit }) {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [createdTaskId, setCreatedTaskId] = useState(null);

  if (!isOpen) return null;

  // Handle form submission differently for create vs edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit) {
      // CREATE MODE: Create task first, then allow file uploads
      const result = await onSubmit(e);
      if (result?.success && result?.data?.id) {
        setCreatedTaskId(result.data.id);
        setShowFileUpload(true);
      }
    } else {
      // EDIT MODE: Just update normally
      await onSubmit(e);
    }
  };

  // Determine if we should show file upload section
  const shouldShowFileUpload = isEdit || createdTaskId;
  const uploadTaskId = isEdit ? task?.id : createdTaskId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        className={`bg-white rounded-lg shadow-xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto ${
          shouldShowFileUpload ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isEdit ? '✏️ Edit Task' : createdTaskId ? '✅ Task Created!' : '➕ Create New Task'}
        </h2>

        {createdTaskId && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Task created successfully! You can now upload files or close this dialog.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show form fields only if task not yet created OR in edit mode */}
          {(!createdTaskId || isEdit) && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={task?.title || ''}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={task?.description || ''}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {isEdit && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={task?.status || 'TODO'}
                      onChange={(e) => setTask({ ...task, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={task?.priority || 'MEDIUM'}
                    onChange={(e) => setTask({ ...task, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={task?.dueDate || ''}
                    onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {categories?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const ids = task?.categoryIds || [];
                          setTask({
                            ...task,
                            categoryIds: ids.includes(cat.id)
                              ? ids.filter((id) => id !== cat.id)
                              : [...ids, cat.id],
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          (task?.categoryIds || []).includes(cat.id)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        style={{
                          backgroundColor: (task?.categoryIds || []).includes(cat.id)
                            ? cat.color
                            : undefined,
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* FILE UPLOAD SECTION */}
          {shouldShowFileUpload && uploadTaskId && (
            <div className="border-t-2 border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📎 File Attachments
                <span className="text-sm font-normal text-gray-500">
                  (Upload documents, images, PDFs)
                </span>
              </h3>

              <FileUpload
                taskId={uploadTaskId}
                onUploadSuccess={() => window.location.reload()}
              />

              <div className="mt-4">
                <AttachmentList
                  attachments={task?.attachments || []}
                  onDelete={() => window.location.reload()}
                />
              </div>
            </div>
          )}

          {/* COMMENT SECTION — only in edit mode */}
          {isEdit && task?.id && (
            <CommentSection taskId={task.id} />
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {!createdTaskId && (
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEdit ? '💾 Update Task' : '➕ Create Task'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setCreatedTaskId(null);
                setShowFileUpload(false);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {createdTaskId ? '✅ Done' : '❌ Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;