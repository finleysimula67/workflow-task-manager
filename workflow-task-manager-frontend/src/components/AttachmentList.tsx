import type { ReactElement } from 'react';
import { useState } from 'react';
import { attachmentApi } from '../api/attachmentApi';
import toast from 'react-hot-toast';
import { Eye, Download, Trash2 } from 'lucide-react';

function AttachmentList({ attachments, onDelete }: { attachments?: any[]; onDelete?: (id: number) => void }): ReactElement | null {
  const [deleting, setDeleting] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const isImage = (fileType: string) => fileType?.startsWith('image/');

  const getFileIcon = (fileType: string) => {
    if (isImage(fileType)) return <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    return <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  };

  const handleDownload = async (e: React.MouseEvent, attachment: any) => {
    e.preventDefault(); e.stopPropagation();
    try {
      const response = await attachmentApi.downloadAttachment(attachment.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = attachment.originalFileName;
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); window.URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download file'); }
  };

  const handlePreview = async (e: React.MouseEvent, attachment: any) => {
    e.preventDefault(); e.stopPropagation();
    if (isImage(attachment.fileType)) {
      try {
        const response = await attachmentApi.downloadAttachment(attachment.id);
        const blob = new Blob([response.data]);
        setPreviewImage({ url: window.URL.createObjectURL(blob), name: attachment.originalFileName });
      } catch { toast.error('Failed to preview image'); }
    } else { toast.info('Preview not available for this file type'); }
  };

  const handleDelete = async (e: React.MouseEvent, attachmentId: number) => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm('Delete this attachment?')) return;
    setDeleting(attachmentId);
    try {
      const response = await attachmentApi.deleteAttachment(attachmentId);
      if (response.success) { toast.success('Attachment deleted!'); if (onDelete) onDelete(attachmentId); }
    } catch { toast.error('Failed to delete attachment'); }
    finally { setDeleting(null); }
  };

  if (!attachments?.length) return null;

  return (
    <>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-400 mb-2">Attachments ({attachments.length})</h4>
        <div className="space-y-2">
          {attachments.map((attachment: any) => (
            <div key={attachment.id} className="flex items-center justify-between p-3 bg-black/40 border border-white/[0.06] rounded-xl hover:bg-white/[0.03] transition">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">{getFileIcon(attachment.fileType)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{attachment.originalFileName}</p>
                  <p className="text-xs text-slate-500">{attachment.formattedFileSize} &bull; {attachment.uploadedByUsername} &bull; {new Date(attachment.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                {isImage(attachment.fileType) && (
                  <button type="button" onClick={(e) => handlePreview(e, attachment)} className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition" title="Preview">
                    <Eye size={18} />
                  </button>
                )}
                <button type="button" onClick={(e) => handleDownload(e, attachment)} className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition" title="Download">
                  <Download size={18} />
                </button>
                <button type="button" onClick={(e) => handleDelete(e, attachment.id)} disabled={deleting === attachment.id} className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition disabled:opacity-50" title="Delete">
                  {deleting === attachment.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400" /> : <Trash2 size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {previewImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50" onClick={() => setPreviewImage(null)}>
          <div className="max-w-4xl max-h-full bg-black border border-white/[0.06] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-black/60 flex justify-between items-center border-b border-white/[0.06]">
              <h3 className="font-semibold text-white">{previewImage.name}</h3>
              <button type="button" onClick={() => setPreviewImage(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 flex justify-center items-center bg-black">
              <img src={previewImage.url} alt={previewImage.name} className="max-w-full max-h-[70vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AttachmentList;
