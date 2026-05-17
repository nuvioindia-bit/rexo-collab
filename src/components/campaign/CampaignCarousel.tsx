import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { DollarSign, Calendar } from 'lucide-react';
import type { Campaign } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CampaignCarouselProps {
  campaigns: Campaign[];
  onSelect?: (campaign: Campaign) => void;
}

export function CampaignCarousel({ campaigns, onSelect }: CampaignCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelectCallback = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelectCallback);
    onSelectCallback();
    return () => { emblaApi.off('select', onSelectCallback); };
  }, [emblaApi, onSelectCallback]);

  if (campaigns.length === 0) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 px-4">
          {campaigns.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              className="flex-[0_0_85%] min-w-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <button
                onClick={() => onSelect?.(campaign)}
                className="w-full text-left rounded-2xl overflow-hidden bg-white border border-[#E8ECF2] shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-[0.97]"
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6C63FF] mb-1.5">
                      {campaign.category}
                    </span>
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-1 drop-shadow-lg">
                      {campaign.title}
                    </h3>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#F7F8FA] flex items-center justify-center overflow-hidden">
                        {campaign.brandLogo ? (
                          <img src={campaign.brandLogo} alt={campaign.brandName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] font-bold text-[#6C63FF]">{campaign.brandName[0]}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#111827]">{campaign.brandName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="w-2.5 h-2.5 text-[#6C63FF]" />
                        {campaign.payout.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDistanceToNow(new Date(campaign.deadline), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {campaigns.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? 'w-4 bg-[#6C63FF]' : 'w-1.5 bg-[#E8ECF2]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
