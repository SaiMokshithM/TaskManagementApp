import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { registerSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch {}
  };

  const fieldClass = (err) =>
    `w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-indigo-400 outline-none transition-all ${
      err ? 'border-2 border-red-400 bg-red-900/10'
          : 'border border-white/20 bg-white/10 focus:border-indigo-400 focus:bg-white/15'}`;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Create account</h2>
      <p className="text-indigo-300 text-sm mb-7">Start managing your tasks today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-1.5">Full Name</label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
            <input {...register('name')} type="text" placeholder="John Doe" className={fieldClass(errors.name)} />
          </div>
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-1.5">Email</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
            <input {...register('email')} type="email" placeholder="you@example.com" className={fieldClass(errors.email)} />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-1.5">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
            <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min 6 characters"
              className={`${fieldClass(errors.password)} pr-10`} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white">
              {showPw ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-1.5">Confirm Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
            <input {...register('confirmPassword')} type={showCPw ? 'text' : 'password'} placeholder="Repeat password"
              className={`${fieldClass(errors.confirmPassword)} pr-10`} />
            <button type="button" onClick={() => setShowCPw(!showCPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white">
              {showCPw ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <motion.button type="submit" disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 mt-2"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : 'Create Account'}
        </motion.button>
      </form>

      <p className="text-center text-indigo-300 text-sm mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-300 hover:text-white font-semibold underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
