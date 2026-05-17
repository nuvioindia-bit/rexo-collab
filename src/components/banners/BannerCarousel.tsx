import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeBanners, type Banner } from '@/firebase/firestore';

const AUTO_SLIDE_MS = 3500;

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);

  useEffect(() => {
    const unsub = subscribeBanners((data) => {
      setBanners(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length]);

  const goTo = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(i);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, AUTO_SLIDE_MS);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo((current + 1) % banners.length);
    else goTo((current - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.link) {
      const url = banner.link.startsWith('http') ? banner.link : `https://${banner.link}`;
      window.open(url, '_blank', 'noopener');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-4 mt-3 mb-2">
        <div className="w-full h-40 rounded-2xl bg-[#F3F1FF] animate-pulse" />
      </div>
    );
  }

  // No banners
  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="mx-4 mt-3 mb-2">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-md"
        style={{ aspectRatio: '16/7' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => handleBannerClick(banner)}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Title */}
            {banner.title && (
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                <p className="text-white font-semibold text-sm text-balance leading-snug drop-shadow">
                  {banner.title}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-2.5 right-3 flex gap-1 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 16 : 6,
                  height: 6,
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
