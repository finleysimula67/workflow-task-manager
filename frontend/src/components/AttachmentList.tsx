import type { ReactElement } from 'react';
import { useState } from 'react';
import { attachmentApi } from '../api/attachmentApi';
import toast from 'react-hot-toast';

function AttachmentList({ attachments, onDelete }) {
  const [deleting, setDeleting] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const isImage = (fileType) => fileType?.startsWith('image/');
  const isPDF = (fileType) => fileType === 'application/pdf';

  const getFileIcon = (fileType) => {
    if (isImage(fileType)) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (isPDF(fileType)) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType?.includes('word') || fileType?.includes('document')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (fileType?.includes('excel') || fileType?.includes('sheet')) {
      return (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  const handleDownload = async (e, attachment) => {
    e.preventDefault(); // ✅ STOP FORM SUBMIT
    e.stopPropagation(); // ✅ STOP EVENT BUBBLING

    try {
      const response = await attachmentApi.downloadAttachment(attachment.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded!');
    } catch (error) {
      toast.error('Failed to download file');
      toast.error('Failed to download file');
    }
  };

  const handlePreview = async (e, attachment) => {
    e.preventDefault(); // ✅ STOP FORM SUBMIT
    e.stopPropagation(); // ✅ STOP EVENT BUBBLING

    if (isImage(attachment.fileType)) {
      try {
        const response = await attachmentApi.downloadAttachment(attachment.id);
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        setPreviewImage({ url, name: attachment.originalFileName });
      } catch (error) {
        toast.error('Failed to preview file');
        toast.error('Failed to preview image');
      }
    } else if (isPDF(attachment.fileType)) {
      handleDownload(e, attachment);
    } else {
      toast.info('Preview not available for this file type');
    }
  };

  const handleDelete = async (e, attachmentId) => {
    e.preventDefault(); // ✅ STOP FORM SUBMIT
    e.stopPropagation(); // ✅ STOP EVENT BUBBLING

    if (!confirm('Are you sure you want to delete this attachment?')) return;

    setDeleting(attachmentId);
    try {
      const response = await attachmentApi.deleteAttachment(attachmentId);
      if (response.success) {
        toast.success('Attachment deleted!');
        if (onDelete) onDelete(attachmentId);
      }
    } catch (error) {
      toast.error('Failed to delete file');
      toast.error('Failed to delete attachment');
    } finally {
      setDeleting(null);
    }
  };

     if (!attachments || attachments.length === 0) {
       return null;
     }

  return (
    <>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Attachments ({attachments.length})
        </h4>

        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(attachment.fileType)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.originalFileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {attachment.formattedFileSize} • {attachment.uploadedByUsername} • {' '}
                    {new Date(attachment.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {/* Preview Button (only for images) */}
                {isImage(attachment.fileType) && (
                  <button
                    type="button" // ✅ IMPORTANT: type="button" prevents form submit
                    onClick={(e) => handlePreview(e, attachment)}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded transition"
                    title="Preview Image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                )}

                {/* Download Button */}
                <button
                  type="button" // ✅ IMPORTANT: type="button" prevents form submit
                  onClick={(e) => handleDownload(e, attachment)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                {/* Delete Button */}
                <button
                  type="button" // ✅ IMPORTANT: type="button" prevents form submit
                  onClick={(e) => handleDelete(e, attachment.id)}
                  disabled={deleting === attachment.id}
                  className="p-2 text-red-600 hover:bg-red-100 rounded transition disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === attachment.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{previewImage.name}</h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex justify-center items-center bg-gray-900">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AttachmentList;