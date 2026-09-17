import { useRef, useState, useCallback } from 'react';
import { UploadCloud, X, FileText, ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  bucket: 'images' | 'documents';
  folder: string;
  value: string | null;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  imagePreview?: boolean;
}

export default function FileUpload({
  bucket,
  folder,
  value,
  onChange,
  accept = 'image/*',
  label = 'Upload file',
  imagePreview = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);

    const ext = file.name.split('.').pop() ?? '';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${folder}/${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = bucket === 'images' ? urlData.publicUrl : urlData.publicUrl;

    if (bucket === 'documents') {
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 31536000);
      if (!signedError && signedData?.signedUrl) {
        onChange(signedData.signedUrl);
      } else {
        onChange(publicUrl);
      }
    } else {
      onChange(publicUrl);
    }

    setProgress(100);
    setUploading(false);
  }, [bucket, folder, onChange]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm text-ink-300 mb-2">{label}</label>

      {value && !uploading && (
        <div className="relative mb-3">
          {imagePreview && isImage(value) ? (
            <div className="relative rounded-xl overflow-hidden border border-ink-700 group">
              <img src={value} alt="Preview" className="w-full max-h-48 object-cover" />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-ink-950/80 backdrop-blur flex items-center justify-center text-ink-200 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-ink-700 bg-ink-900">
              <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-accent-400" />
              </div>
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-200 hover:text-accent-400 transition-colors truncate flex-1">
                {value.split('/').pop() ?? 'View file'}
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-ink-400 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {!value && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-6 flex flex-col items-center justify-center gap-3 min-h-[120px] ${
            dragging
              ? 'border-accent-500 bg-accent-500/5'
              : 'border-ink-700 hover:border-ink-600 bg-ink-900/50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-accent-400 animate-spin" />
              <p className="text-ink-300 text-sm">Uploading... {progress}%</p>
              <div className="w-full max-w-xs h-1.5 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-ink-800 flex items-center justify-center">
                {accept.includes('image') ? <ImageIcon size={22} className="text-ink-400" /> : <UploadCloud size={22} className="text-ink-400" />}
              </div>
              <div className="text-center">
                <p className="text-ink-200 text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-ink-500 text-xs mt-1">
                  {accept.includes('image') ? 'PNG, JPG, GIF, WebP, SVG' : 'PDF, DOC, DOCX'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-ink-400 hover:text-accent-400 transition-colors mt-2 flex items-center gap-1.5"
        >
          <UploadCloud size={14} /> Replace file
        </button>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}

      {value && !uploading && !error && (
        <div className="flex items-center gap-1.5 text-green-400 text-xs mt-2">
          <CheckCircle size={14} /> Uploaded
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
