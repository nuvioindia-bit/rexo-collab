import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Link, Type, ImageIcon, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subscribeBanners, addBanner, deleteBanner, updateBanner, type Banner } from '@/firebase/firestore';
import { uploadBannerImage } from '@/firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedFile = useRef<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Admin नहीं है तो redirect
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast.error('Admin access नहीं है।');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const unsub = subscribeBanners((data) => {
      setBanners(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('सिर्फ image files select करें।');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image 5MB से छोटी होनी चाहिए।');
      return;
    }
    selectedFile.current = file;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddBanner = async () => {
    if (!selectedFile.current) {
      toast.error('पहले image select करें।');
      return;
    }
    if (!title.trim()) {
      toast.error('Title जरूरी है।');
      return;
    }
    setUploading(true);
    const { url, error } = await uploadBannerImage(selectedFile.current);
    if (error || !url) {
      toast.error(error || 'Upload failed');
      setUploading(false);
      return;
    }
    const maxOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order)) : 0;
    await addBanner({ imageUrl: url, title: title.trim(), link: link.trim(), order: maxOrder + 1 });
    toast.success('Banner add हो गया!');
    // Reset
    setTitle('');
    setLink('');
    setPreviewUrl('');
    selectedFile.current = null;
    if (fileRef.current) fileRef.current.value = '';
    setUploading(false);
  };

  const handleDelete = async (b: Banner) => {
    setDeletingId(b.id);
    await deleteBanner(b.id);
    toast.success('Banner delete हो गया।');
    setDeletingId(null);
  };

  const handleMoveUp = async (i: number) => {
    if (i === 0) return;
    const curr = banners[i];
    const prev = banners[i - 1];
    await Promise.all([
      updateBanner(curr.id, { order: prev.order }),
      updateBanner(prev.id, { order: curr.order }),
    ]);
  };

  const handleMoveDown = async (i: number) => {
    if (i === banners.length - 1) return;
    const curr = banners[i];
    const next = banners[i + 1];
    await Promise.all([
      updateBanner(curr.id, { order: next.order }),
      updateBanner(next.id, { order: curr.order }),
    ]);
  };

  return (
    <div
      className="min-h-[100dvh] bg-[#F7F8FA] flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#E8ECF2] px-4 pb-3 flex items-center gap-3"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px) + 10px, 14px)' }}>
        <button onClick={() => navigate(-1)} className="p-2 -ml-1 rounded-xl hover:bg-[#F7F8FA] transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#111827]">Admin Panel</h1>
          <p className="text-xs text-[#6B7280]">Banner management</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">

        {/* ── Add Banner Card ── */}
        <div className="bg-white rounded-2xl border border-[#E8ECF2] shadow-sm p-4 space-y-3">
          <h2 className="text-sm font-bold text-[#111827]">नया Banner जोड़ें</h2>

          {/* Image picker */}
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-[#E8ECF2] bg-[#F7F8FA] overflow-hidden cursor-pointer active:opacity-80 transition-opacity"
            style={{ aspectRatio: '16/7' }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                <ImageIcon className="w-7 h-7 text-[#9CA3AF]" />
                <p className="text-xs text-[#6B7280] font-medium">Image tap करके select करें</p>
                <p className="text-[10px] text-[#9CA3AF]">JPG, PNG, WebP · Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {/* Title */}
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Banner का title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-9 h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm"
            />
          </div>

          {/* Link */}
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Redirect link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="pl-9 h-11 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm"
            />
          </div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleAddBanner}
              disabled={uploading || !previewUrl || !title.trim()}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white font-semibold text-sm shadow-sm"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Upload हो रहा है...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Banner जोड़ें
                </span>
              )}
            </Button>
          </motion.div>
        </div>

        {/* ── Existing Banners ── */}
        <div className="bg-white rounded-2xl border border-[#E8ECF2] shadow-sm p-4">
          <h2 className="text-sm font-bold text-[#111827] mb-3">
            मौजूदा Banners ({banners.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-[#F3F1FF] animate-pulse" />
              ))}
            </div>
          ) : banners.length === 0 ? (
            <div className="py-8 text-center">
              <ImageIcon className="w-10 h-10 text-[#D1D5DB] mx-auto mb-2" />
              <p className="text-sm text-[#9CA3AF]">अभी कोई banner नहीं है।</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {banners.map((b, i) => (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 p-2 rounded-xl border border-[#E8ECF2] bg-[#F7F8FA]"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-[#E8ECF2]">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#111827] truncate">{b.title}</p>
                      {b.link && (
                        <p className="text-[10px] text-[#6B7280] truncate">{b.link}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(i)}
                        disabled={i === 0}
                        className="p-1.5 rounded-lg hover:bg-[#E8ECF2] disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(i)}
                        disabled={i === banners.length - 1}
                        className="p-1.5 rounded-lg hover:bg-[#E8ECF2] disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        disabled={deletingId === b.id}
                        className="p-1.5 rounded-lg hover:bg-[#FEF2F2] text-[#EF4444] transition-colors"
                      >
                        {deletingId === b.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
