import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<UserRole>('creator');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep('details');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password) {
      toast.error('सभी fields भरें।');
      return;
    }
    if (password.length < 6) {
      toast.error('Password कम से कम 6 characters का होना चाहिए।');
      return;
    }
    setIsLoading(true);
    const { error } = await registerUser(email.trim(), password, displayName.trim(), role);
    setIsLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Account बन गया! Welcome to Rexo Collab 🎉');
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4EA8FF] flex items-center justify-center mb-5 shadow-lg">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            {step === 'role' ? 'शुरू करें' : 'Account बनाएं'}
          </h1>
          <p className="text-sm text-[#6B7280] mt-1.5">
            {step === 'role' ? 'अपना account type चुनें' : 'अपनी details भरें'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'role' ? (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              className="space-y-3"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect('creator')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#E8ECF2] bg-white hover:border-[#6C63FF] hover:bg-[#F3F1FF]/30 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F3F1FF] flex items-center justify-center group-hover:bg-[#6C63FF] transition-colors shrink-0">
                  <Sparkles className="w-5 h-5 text-[#6C63FF] group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#111827] text-sm">Creator / Influencer</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Campaigns browse करें और apply करें</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] ml-auto group-hover:text-[#6C63FF] transition-colors shrink-0" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect('brand')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#E8ECF2] bg-white hover:border-[#4EA8FF] hover:bg-[#E8F4FF]/30 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8F4FF] flex items-center justify-center group-hover:bg-[#4EA8FF] transition-colors shrink-0">
                  <Building2 className="w-5 h-5 text-[#4EA8FF] group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#111827] text-sm">Brand / Company</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Campaigns post करें और creators ढूंढें</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] ml-auto group-hover:text-[#4EA8FF] transition-colors shrink-0" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <button type="button" onClick={() => setStep('role')} className="text-xs text-[#6B7280] hover:text-[#111827]">
                  ← वापस
                </button>
                <div className="flex items-center gap-1.5">
                  {role === 'creator'
                    ? <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
                    : <Building2 className="w-3.5 h-3.5 text-[#4EA8FF]" />
                  }
                  <span className="text-xs font-medium text-[#111827]">
                    {role === 'creator' ? 'Creator' : 'Brand'} account
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] mb-1.5 block">
                  {role === 'creator' ? 'पूरा नाम' : 'Company का नाम'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    type="text"
                    placeholder={role === 'creator' ? 'Alex Rivera' : 'Nova Apparel'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm focus-visible:ring-[#6C63FF]/30 focus-visible:border-[#6C63FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm focus-visible:ring-[#6C63FF]/30 focus-visible:border-[#6C63FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111827] mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="कम से कम 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm focus-visible:ring-[#6C63FF]/30 focus-visible:border-[#6C63FF]"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    {showPassword ? <EyeOff className="w-4 h-4 text-[#9CA3AF]" /> : <Eye className="w-4 h-4 text-[#9CA3AF]" />}
                  </button>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4EA8FF] text-white font-semibold text-sm shadow-md hover:opacity-95 transition-opacity"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Account बनाएं <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-6 text-center"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 32px)' }}
      >
        <p className="text-xs text-[#6B7280]">
          पहले से account है?{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-[#6C63FF]">
            Sign in करें
          </button>
        </p>
      </motion.div>
    </div>
  );
}
