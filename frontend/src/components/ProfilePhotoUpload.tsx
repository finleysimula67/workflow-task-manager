import { useState, useRef, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { Camera, Upload, X, RotateCcw, ZoomIn, Sun, Contrast, RefreshCw, Check, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

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
    resetAll();
  };

  const resetAll = () => {
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

    ctx.clearRect(0, 0, size, size);
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

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
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

  if (!showEditor) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative group">
          {currentPhoto ? (
            <img 
              src={currentPhoto} 
              alt={username} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700 shadow-lg" 
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-slate-200 dark:border-slate-700 shadow-lg">
              <span className="text-white text-4xl sm:text-5xl font-bold">{getInitials(username)}</span>
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="w-10 h-10 text-white" />
          </button>
        </div>
        
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Upload size={18} />
          Change Photo
        </button>
        
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">JPG, PNG, GIF, WebP - Max 30MB</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Edit Photo</h3>
          <button onClick={closeEditor} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div 
          ref={containerRef}
          className="p-3 flex justify-center bg-slate-50 dark:bg-slate-800/50 shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-600 shadow-lg">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="p-3 sm:p-4 flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 sm:gap-2">
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Zoom
                </label>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:dark:bg-blue-500 [&::-webkit-slider-runnable-track]:bg-slate-200 dark:[&::-webkit-slider-runnable-track]:bg-slate-600"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 sm:gap-2">
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Brightness
                </label>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:dark:bg-blue-500 [&::-webkit-slider-runnable-track]:bg-slate-200 dark:[&::-webkit-slider-runnable-track]:bg-slate-600"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 sm:gap-2">
                  <Contrast className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Contrast
                </label>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:dark:bg-blue-500 [&::-webkit-slider-runnable-track]:bg-slate-200 dark:[&::-webkit-slider-runnable-track]:bg-slate-600"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 sm:gap-2">
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Rotation
                </label>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">{rotation}deg</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:dark:bg-blue-500 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:dark:bg-blue-500 [&::-webkit-slider-runnable-track]:bg-slate-200 dark:[&::-webkit-slider-runnable-track]:bg-slate-600"
              />
            </div>
          </div>

          <div className="mt-4 space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 sm:gap-2">
              Position
            </label>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => moveImage(0, -10)}
                className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition text-slate-700 dark:text-slate-200"
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => moveImage(-10, 0)}
                  className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition text-slate-700 dark:text-slate-200"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => moveImage(0, 10)}
                  className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition text-slate-700 dark:text-slate-200"
                >
                  <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => moveImage(10, 0)}
                  className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition text-slate-700 dark:text-slate-200"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-between p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Reset
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={closeEditor}
              className="px-4 sm:px-5 py-2 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 text-sm"
            >
              {uploading ? (
                <>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
