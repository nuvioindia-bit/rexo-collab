import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, ArrowRight, Link2, Upload } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { addApplication } from '@/firebase/firestore';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Application } from '@/types';

const steps = [
  { id: 1, label: 'Category', title: 'Content Category' },
  { id: 2, label: 'Audience', title: 'Audience Stats' },
  { id: 3, label: 'Socials', title: 'Social Links' },
  { id: 4, label: 'Pricing', title: 'Your Rate' },
  { id: 5, label: 'Portfolio', title: 'Portfolio' },
  { id: 6, label: 'Submit', title: 'Review & Submit' },
];

const contentCategories = ['Fashion', 'Technology', 'Beauty', 'Fitness', 'Travel', 'Lifestyle', 'Food', 'Gaming'];

export default function ApplyFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const { user } = useAuth();
  const campaign = state.campaigns.find((c) => c.id === id);

  const [currentStep, setCurrentStep] = useState(0);
  const [category, setCategory] = useState('');
  const [followers, setFollowers] = useState('');
  const [engagement, setEngagement] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [rate, setRate] = useState(campaign?.payout ? String(campaign.payout) : '');
  const [negotiable, setNegotiable] = useState(true);
  const [pitch, setPitch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Campaign नहीं मिला</p>
      </div>
    );
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!category;
      case 1: return !!followers && !!engagement;
      case 2: return !!instagram || !!youtube || !!tiktok;
      case 3: return !!rate;
      case 4: return !!pitch;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep((s) => s - 1); else navigate(-1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const application: Omit<Application, 'id'> = {
      campaignId: campaign.id,
      creatorId: user?.uid || '',
      creatorName: user?.displayName || '',
      status: 'pending',
      pitch,
      proposedRate: Number(rate),
      portfolioLinks: [instagram, youtube, tiktok].filter(Boolean),
      socialLinks: { instagram, youtube, tiktok },
      audienceStats: { followers: Number(followers), engagement: Number(engagement), platform },
      createdAt: new Date().toISOString().split('T')[0],
    };
    await addApplication(application);
    toast.success('Application submit हो गई! 🎉');
    navigate('/campaigns');
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };
  const [direction, setDirection] = useState(1);

  const next = () => { setDirection(1); handleNext(); };
  const back = () => { setDirection(-1); handleBack(); };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-[#F3F4F6]">
        <button onClick={back} className="p-2 -ml-1 rounded-xl hover:bg-[#F7F8FA] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide font-semibold">Apply</p>
          <p className="text-sm font-bold text-[#111827] truncate">{campaign.title}</p>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {steps.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-300"
            style={{
              width: i === currentStep ? 18 : 6, height: 6,
              background: i <= currentStep ? '#6C63FF' : '#E8ECF2',
            }} />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden px-5">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="h-full"
          >
            <h2 className="text-lg font-bold text-[#111827] mb-4 mt-2 text-balance">{steps[currentStep].title}</h2>

            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-2">
                {contentCategories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      category === cat ? 'border-[#6C63FF] bg-[#F3F1FF] text-[#6C63FF]' : 'border-[#E8ECF2] text-[#6B7280]'
                    }`}>{cat}</button>
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Total Followers</label>
                  <Input type="number" placeholder="e.g. 50000" value={followers} onChange={(e) => setFollowers(e.target.value)}
                    className="h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Engagement Rate (%)</label>
                  <Input type="number" placeholder="e.g. 3.5" value={engagement} onChange={(e) => setEngagement(e.target.value)}
                    className="h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Primary Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Instagram', 'YouTube', 'TikTok'].map((p) => (
                      <button key={p} onClick={() => setPlatform(p)}
                        className={`py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                          platform === p ? 'border-[#6C63FF] bg-[#F3F1FF] text-[#6C63FF]' : 'border-[#E8ECF2] text-[#6B7280]'
                        }`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {[{ label: 'Instagram', val: instagram, set: setInstagram, ph: '@username' },
                  { label: 'YouTube', val: youtube, set: setYoutube, ph: 'channel URL' },
                  { label: 'TikTok', val: tiktok, set: setTiktok, ph: '@username' }].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label className="text-xs font-semibold text-[#111827] mb-1.5 block flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#6B7280]" />{label}
                    </label>
                    <Input placeholder={ph} value={val} onChange={(e) => set(e.target.value)}
                      className="h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Proposed Rate (₹)</label>
                  <Input type="number" placeholder="e.g. 5000" value={rate} onChange={(e) => setRate(e.target.value)}
                    className="h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl" />
                </div>
                <button onClick={() => setNegotiable(!negotiable)}
                  className={`flex items-center gap-2 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all w-full ${
                    negotiable ? 'border-[#6C63FF] bg-[#F3F1FF] text-[#6C63FF]' : 'border-[#E8ECF2] text-[#6B7280]'
                  }`}>
                  {negotiable && <Check className="w-4 h-4" />} Negotiable
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Why should we work together?</label>
                  <textarea
                    placeholder="अपना pitch लिखें..."
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-3 bg-[#F7F8FA] border border-[#E8ECF2] rounded-xl text-sm text-[#111827] resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]"
                  />
                </div>
                <div className="border-2 border-dashed border-[#E8ECF2] rounded-xl p-6 flex flex-col items-center gap-2 text-center">
                  <Upload className="w-7 h-7 text-[#9CA3AF]" />
                  <p className="text-xs text-[#6B7280] font-medium">Portfolio samples</p>
                  <p className="text-[10px] text-[#9CA3AF]">Coming soon</p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-3">
                {[
                  { label: 'Category', value: category },
                  { label: 'Followers', value: Number(followers).toLocaleString() },
                  { label: 'Platform', value: platform },
                  { label: 'Rate', value: `₹${Number(rate).toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 border-b border-[#F3F4F6] last:border-0">
                    <span className="text-xs text-[#6B7280] font-medium">{label}</span>
                    <span className="text-xs font-semibold text-[#111827]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-6 pt-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={currentStep === steps.length - 1 ? handleSubmit : next}
          disabled={!canProceed() || isSubmitting}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white font-semibold text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : currentStep === steps.length - 1 ? (
            <><Check className="w-4 h-4" /> Submit Application</>
          ) : (
            <>Next <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
