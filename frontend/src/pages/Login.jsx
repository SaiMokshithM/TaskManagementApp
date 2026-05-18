import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch {}
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
      <p className="text-indigo-300 text-sm mb-7">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-1.5">Email</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
            <input {...register('email')} type="email" placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-indigo-400 outline-none transition-all
                ${errors.email
                  ? 'border-2 border-red-400 bg-red-900/10'
                  : 'border border-white/20 bg-white/10 focus:border-indigo-400 focus:bg-white/15'}`} />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-1.5">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
            <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-indigo-400 outline-none transition-all
                ${errors.password
                  ? 'border-2 border-red-400 bg-red-900/10'
                  : 'border border-white/20 bg-white/10 focus:border-indigo-400 focus:bg-white/15'}`} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white">
              {showPw ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <motion.button type="submit" disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : 'Sign In'}
        </motion.button>
      </form>

      <p className="text-center text-indigo-300 text-sm mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-300 hover:text-white font-semibold underline underline-offset-2">
          Create one
        </Link>
      </p>
    </div>
  );
}
