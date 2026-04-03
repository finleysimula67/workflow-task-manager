import type { ReactElement } from 'react';
import { useState } from 'react';
import { attachmentApi } from '../api/attachmentApi';
import toast from 'react-hot-toast';

function FileUpload({ taskId, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 10MB

  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
  ];

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit');
      return false;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(`File type not allowed: ${file.type}`);
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file) => {
    if (!validateFile(file)) {
      return;
    }

    setUploading(true);

    try {
      // Upload in progress

      const response = await attachmentApi.uploadFile(taskId, file);

      if (response.success) {
        toast.success('File uploaded successfully!');
        // Upload completed

        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
      }
    } catch (error) {
      toast.error('Failed to upload file');
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Attachments
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={`file-upload-${taskId}`}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        <label
          htmlFor={`file-upload-${taskId}`}
          className={uploading ? 'cursor-not-allowed' : 'cursor-pointer'}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, Images, Documents up to 10MB
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default FileUpload;