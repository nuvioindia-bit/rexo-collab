import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Email और password दोनों भरें।');
      return;
    }
    setIsLoading(true);
    const { error } = await loginUser(email.trim(), password);
    setIsLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Welcome back! 🎉');
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4EA8FF] flex items-center justify-center mb-5 shadow-lg">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Welcome back</h1>
          <p className="text-sm text-[#6B7280] mt-1.5">अपने creator marketplace में sign in करें</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
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
                placeholder="अपना password डालें"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-[#F7F8FA] border-[#E8ECF2] rounded-xl text-sm focus-visible:ring-[#6C63FF]/30 focus-visible:border-[#6C63FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
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
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="px-6 pb-8 text-center"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 32px)' }}
      >
        <p className="text-xs text-[#6B7280]">
          Account नहीं है?{' '}
          <button onClick={() => navigate('/register')} className="font-semibold text-[#6C63FF]">
            Register करें
          </button>
        </p>
      </motion.div>
    </div>
  );
}
