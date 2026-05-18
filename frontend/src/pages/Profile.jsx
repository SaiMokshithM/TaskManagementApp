import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineLogout } from 'react-icons/hi';
import { formatDateTime } from '../utils/formatDate';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your account information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-28 w-full" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)' }} />

        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white dark:border-slate-800"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
          <span className={`badge mt-1 ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
            {user?.role}
          </span>
        </div>

        <div className="border-t dark:border-slate-700 px-6 py-5 space-y-3">
          <InfoRow icon={HiOutlineUser}        label="Full Name"   value={user?.name} />
          <InfoRow icon={HiOutlineMail}        label="Email"       value={user?.email} />
          <InfoRow icon={HiOutlineShieldCheck} label="Role"        value={user?.role} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-slate-700 dark:text-white mb-4">Account Actions</h3>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm">
          <HiOutlineLogout size={18} /> Sign Out of Account
        </button>
      </motion.div>
    </div>
  );
}
