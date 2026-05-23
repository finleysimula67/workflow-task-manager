import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { Camera, Upload, X, RotateCcw, ZoomIn, Sun, Contrast, RefreshCw, Check, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  username: string;
  onPhotoUpdate?: (newPhoto: string) => void;
}

export default function ProfilePhotoUpload({ currentPhoto, username, onPhotoUpdate }: ProfilePhotoUploadProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; dist: number } | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  useEffect(() => {
    if (showEditor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showEditor]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 30 * 1024 * 1024) {
      toast.error('File size exceeds 30MB limit');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowEditor(true);
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setOffsetX(0);
    setOffsetY(0);
  };

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const maxOffset = (zoom - 1) * size / 2;
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, offsetY));
    ctx.translate(clampedX / zoom, clampedY / zoom);

    const scale = size / Math.max(img.width, img.height);
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;

    const hasFilters = brightness !== 100 || contrast !== 100;
    if (hasFilters) {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    }
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    ctx.restore();
  }, [zoom, brightness, contrast, rotation, offsetX, offsetY]);

  useEffect(() => {
    if (previewUrl && showEditor) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        applyFilters();
      };
      img.src = previewUrl;
    }
  }, [previewUrl, showEditor, applyFilters]);

  useEffect(() => {
    if (showEditor) {
      applyFilters();
    }
  }, [zoom, brightness, contrast, rotation, offsetX, offsetY, applyFilters, showEditor]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      touchStartRef.current = { x: zoom, y: 0, dist };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / touchStartRef.current.dist;
      const newZoom = Math.max(0.5, Math.min(2, touchStartRef.current.x * scale));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const moveImage = (dx: number, dy: number) => {
    setOffsetX(prev => prev + dx);
    setOffsetY(prev => prev + dy);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setUploading(true);
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to process image');
          setUploading(false);
          return;
        }

        const file = new File([blob], 'profile-photo.png', { type: 'image/png' });
        const response = await authApi.uploadProfilePhoto(file);

        if (response.success) {
          toast.success('Profile photo updated!');
          const fullUrl = `http://localhost:8080${response.data.profileImage}`;
          onPhotoUpdate?.(fullUrl);
          closeEditor();
        }
      }, 'image/png');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const closeEditor = () => {
    setShowEditor(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col items-center">
        <div className="relative group">
          {currentPhoto ? (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/[0.08] shadow-lg">
              <img src={currentPhoto} alt={username} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-4 border-white/[0.08] shadow-lg">
              <span className="text-white text-4xl sm:text-5xl font-bold">{getInitials(username)}</span>
            </div>
          )}
          <button onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-10 h-10 text-white" />
          </button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <button onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition">
          <Upload size={18} /> Change Photo
        </button>

        <p className="mt-2 text-xs text-slate-500">JPG, PNG, GIF, WebP - Max 30MB</p>
      </motion.div>

      {showEditor && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg mx-auto bg-[#111] border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
              <h3 className="text-base font-semibold text-white">Edit Photo</h3>
              <button onClick={closeEditor} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div ref={containerRef} className="px-5 py-6 flex justify-center bg-black/50 shrink-0"
              onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white/[0.06] shadow-xl">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="px-5 py-4 flex-1 overflow-y-auto min-h-0 space-y-4">
              <div className="space-y-4">
                <SliderControl icon={<ZoomIn className="w-3.5 h-3.5" />} label="Zoom" value={`${Math.round(zoom * 100)}%`}
                  min="0.5" max="2" step="0.1" valueNum={zoom} onChange={(v) => setZoom(parseFloat(v))} />
                <SliderControl icon={<Sun className="w-3.5 h-3.5" />} label="Brightness" value={`${brightness}%`}
                  min="50" max="200" step="5" valueNum={brightness} onChange={(v) => setBrightness(parseInt(v))} />
                <SliderControl icon={<Contrast className="w-3.5 h-3.5" />} label="Contrast" value={`${contrast}%`}
                  min="50" max="200" step="5" valueNum={contrast} onChange={(v) => setContrast(parseInt(v))} />
                <SliderControl icon={<RotateCcw className="w-3.5 h-3.5" />} label="Rotation" value={`${rotation}°`}
                  min="0" max="360" step="15" valueNum={rotation} onChange={(v) => setRotation(parseInt(v))} />
              </div>

              <div className="flex items-center justify-center gap-1 pt-2">
                <button onClick={() => moveImage(0, -10)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => moveImage(-10, 0)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /></button>
                <div className="w-8 h-8 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /></div>
                <button onClick={() => moveImage(10, 0)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"><ArrowRight className="w-3.5 h-3.5" /></button>
                <button onClick={() => moveImage(0, 10)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"><ArrowDown className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
              <button onClick={() => { setZoom(1); setBrightness(100); setContrast(100); setRotation(0); setOffsetX(0); setOffsetY(0); }}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition text-sm font-medium">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <div className="flex gap-3">
                <button onClick={closeEditor}
                  className="px-5 py-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition text-sm font-medium">Cancel</button>
                <button onClick={handleSave} disabled={uploading}
                  className="flex items-center gap-2 px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition disabled:opacity-50 text-sm shadow-lg shadow-primary-500/20">
                  {uploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    : <><Check className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function SliderControl({ icon, label, value, min, max, step, valueNum, onChange }: {
  icon: React.ReactNode; label: string; value: string;
  min: string; max: string; step: string; valueNum: number; onChange: (v: string) => void;
}) {
  const pct = ((valueNum - parseFloat(min)) / (parseFloat(max) - parseFloat(min))) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">{icon} {label}</label>
        <span className="text-xs text-slate-500 tabular-nums">{value}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-primary-500 transition-all duration-150" style={{ width: `${pct}%` }} />
        </div>
        <input type="range" min={min} max={max} step={step} value={valueNum}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-x-0 w-full h-1.5 opacity-0 cursor-pointer z-10" />
        <div className="absolute w-4 h-4 rounded-full bg-primary-500 border-2 border-white/20 shadow-lg shadow-primary-500/30 pointer-events-none transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
    </div>
  );
}
