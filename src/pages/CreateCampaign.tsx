import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, DollarSign, Calendar, Target, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/stores/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { addCampaign as addCampaignFS } from '@/firebase/firestore';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Campaign } from '@/types';

const categories = ['Fashion', 'Technology', 'Beauty', 'Fitness', 'Travel', 'Lifestyle', 'Food', 'Gaming'];

const steps = [
  { id: 1, label: 'Details', title: 'Campaign Details' },
  { id: 2, label: 'Requirements', title: 'Requirements' },
  { id: 3, label: 'Deliverables', title: 'Deliverables' },
  { id: 4, label: 'Review', title: 'Review & Publish' },
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { addCampaign } = useApp();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [payout, setPayout] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requirements, setRequirements] = useState(['', '']);
  const [deliverables, setDeliverables] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!title && !!description && !!category && !!payout && !!deadline;
      case 1: return requirements.some((r) => !!r);
      case 2: return deliverables.some((d) => !!d);
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else navigate(-1);
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCampaign: Campaign = {
      id: `c-${Date.now()}`,
      brandId: user?.uid || '',
      brandName: 'Nova Apparel',
      brandLogo: 'https://images.unsplash.com/photo-1560179708-fd1db2e9dfae?w=100&h=100&fit=crop',
      title,
      description,
      requirements: requirements.filter(Boolean),
      deliverables: deliverables.filter(Boolean),
      payout: Number(payout),
      currency: 'USD',
      deadline,
      category,
      status: 'active',
      creatorRequirements: {},
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addCampaign(newCampaign);
    addCampaignFS(newCampaign).catch(console.error);
    toast.success('Campaign published successfully!');
    navigate('/brand-dashboard');
  };

  const updateRequirement = (i: number, value: string) => {
    const next = [...requirements];
    next[i] = value;
    setRequirements(next);
  };

  const updateDeliverable = (i: number, value: string) => {
    const next = [...deliverables];
    next[i] = value;
    setDeliverables(next);
  };

  const addField = (type: 'req' | 'del') => {
    if (type === 'req') setRequirements([...requirements, '']);
    else setDeliverables([...deliverables, '']);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Campaign Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Spring Collection Launch" className="h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your campaign..." rows={3} className="w-full px-4 py-3 rounded-xl bg-[#F7F8FA] border border-[#E8ECF2] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF] resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`p-2.5 rounded-xl border-2 text-xs font-medium text-left transition-all ${category === cat ? 'border-[#6C63FF] bg-[#F3F1FF] text-[#6C63FF]' : 'border-[#E8ECF2] bg-white text-[#111827]'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Payout ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input type="number" value={payout} onChange={(e) => setPayout(e.target.value)} placeholder="3000" className="pl-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="pl-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-3">
            <p className="text-sm text-[#6B7280]">What do you require from creators?</p>
            {requirements.map((req, i) => (
              <div key={i} className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <Input value={req} onChange={(e) => updateRequirement(i, e.target.value)} placeholder={`Requirement ${i + 1}`} className="pl-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
              </div>
            ))}
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => addField('req')} className="w-full h-11 rounded-xl border-2 border-dashed border-[#E8ECF2] text-xs font-medium text-[#6B7280] hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors">
              + Add Requirement
            </motion.button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <p className="text-sm text-[#6B7280]">What content do you expect?</p>
            {deliverables.map((del, i) => (
              <div key={i} className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <Input value={del} onChange={(e) => updateDeliverable(i, e.target.value)} placeholder={`Deliverable ${i + 1}`} className="pl-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm" />
              </div>
            ))}
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => addField('del')} className="w-full h-11 rounded-xl border-2 border-dashed border-[#E8ECF2] text-xs font-medium text-[#6B7280] hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors">
              + Add Deliverable
            </motion.button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-[#F7F8FA] rounded-2xl p-4 border border-[#E8ECF2]">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Campaign Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#6B7280]">Title</span><span className="font-medium text-[#111827]">{title}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Category</span><span className="font-medium text-[#111827]">{category}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Payout</span><span className="font-medium text-[#111827]">${Number(payout).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Deadline</span><span className="font-medium text-[#111827]">{deadline}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Requirements</span><span className="font-medium text-[#111827]">{requirements.filter(Boolean).length}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Deliverables</span><span className="font-medium text-[#111827]">{deliverables.filter(Boolean).length}</span></div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F3F1FF]">
              <Check className="w-4 h-4 text-[#6C63FF] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#6C63FF] leading-relaxed">By publishing, your campaign will be visible to all creators on the platform.</p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleBack} className="w-10 h-10 rounded-xl bg-[#F7F8FA] flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-[#111827]" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[#111827]">{steps[currentStep].title}</h1>
          <p className="text-[10px] text-[#6B7280]">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s.id} className={`h-1 rounded-full flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-[#6C63FF]' : 'bg-[#E8ECF2]'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 overflow-y-auto no-scrollbar">
        {renderStep()}
      </div>

      <div className="px-5 py-4 border-t border-[#E8ECF2]">
        {currentStep < steps.length - 1 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleNext} disabled={!canProceed()} className={`w-full h-14 rounded-2xl font-semibold text-sm transition-all ${canProceed() ? 'bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white shadow-float' : 'bg-[#F7F8FA] text-[#9CA3AF] cursor-not-allowed'}`}>
            <span className="flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
          </motion.button>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handlePublish} disabled={isSubmitting} className="w-full h-14 rounded-2xl font-semibold text-sm bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white shadow-float transition-all">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Publish Campaign</span>}
          </motion.button>
        )}
      </div>
    </div>
  );
}
