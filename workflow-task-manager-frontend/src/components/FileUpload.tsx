import type { ReactElement } from 'react';
import { useState } from 'react';
import { attachmentApi } from '../api/attachmentApi';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

function FileUpload({ taskId, onUploadSuccess }: { taskId: number; onUploadSuccess?: (data?: any) => void }): ReactElement {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'application/zip',
  ];

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) { toast.error('File size exceeds 10MB limit'); return false; }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) { toast.error(`File type not allowed`); return false; }
    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;
    setUploading(true);
    try {
      const response = await attachmentApi.uploadFile(taskId, file);
      if (response.success) { toast.success('File uploaded!'); if (onUploadSuccess) onUploadSuccess(response.data); }
    } catch (error: any) { toast.error(error.message || 'Failed to upload file'); }
    finally { setUploading(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); };
  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]); };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-400 mb-2">Attachments</label>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
          dragActive ? 'border-white/10 bg-white/5' : 'border-white/[0.06] hover:border-white/[0.08]'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <input type="file" id={`file-upload-${taskId}`} onChange={handleFileSelect} disabled={uploading} className="hidden" />
        <label htmlFor={`file-upload-${taskId}`} className={uploading ? 'cursor-not-allowed' : 'cursor-pointer'}>
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/30 mb-3"></div>
              <p className="text-slate-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-slate-400 mb-1"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-500">PDF, Images, Documents up to 10MB</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default FileUpload;
