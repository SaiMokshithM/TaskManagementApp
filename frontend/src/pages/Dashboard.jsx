import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { HiOutlineClipboardList, HiOutlineClock, HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineExclamation } from 'react-icons/hi';
import useTaskStore from '../store/useTaskStore';
import { formatDateTime, formatDate, isOverdue } from '../utils/formatDate';

const STATUS_COLORS = { PENDING: '#94a3b8', IN_PROGRESS: '#6366f1', COMPLETED: '#10b981' };
const PRIORITY_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };

function StatCard({ icon: Icon, label, value, color, loading }) {
  if (loading) return <div className="skeleton h-28 rounded-2xl" />;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="card-hover rounded-2xl p-5 shadow-md flex items-center gap-4"
      style={{ background: 'white' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-slate-500 text-sm font-medium mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { stats, statsLoading, fetchStats, tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, []);

  const pieData = stats ? [
    { name: 'Pending',     value: Number(stats.pendingTasks) },
    { name: 'In Progress', value: Number(stats.inProgressTasks) },
    { name: 'Completed',   value: Number(stats.completedTasks) },
  ] : [];

  const barData = stats ? [
    { name: 'High',   count: Number(stats.highPriorityTasks),   fill: '#ef4444' },
    { name: 'Medium', count: Number(stats.mediumPriorityTasks), fill: '#f59e0b' },
    { name: 'Low',    count: Number(stats.lowPriorityTasks),    fill: '#10b981' },
  ] : [];

  const completionRate = stats && stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your task overview and analytics
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineClipboardList} label="Total Tasks"   value={stats?.totalTasks ?? 0}     color="#6366f1" loading={statsLoading} />
        <StatCard icon={HiOutlineClock}         label="Pending"       value={stats?.pendingTasks ?? 0}   color="#94a3b8" loading={statsLoading} />
        <StatCard icon={HiOutlineRefresh}       label="In Progress"   value={stats?.inProgressTasks ?? 0} color="#6366f1" loading={statsLoading} />
        <StatCard icon={HiOutlineCheckCircle}   label="Completed"     value={stats?.completedTasks ?? 0} color="#10b981" loading={statsLoading} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md col-span-1">
          <h3 className="font-semibold text-slate-700 dark:text-white mb-4">Status Breakdown</h3>
          {statsLoading ? <div className="skeleton h-44 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name === 'In Progress' ? 'IN_PROGRESS' : entry.name.toUpperCase()]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md col-span-1">
          <h3 className="font-semibold text-slate-700 dark:text-white mb-4">Priority Distribution</h3>
          {statsLoading ? <div className="skeleton h-44 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={32}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {barData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Progress + overdue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md col-span-1 space-y-5">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-white mb-3">Completion Rate</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${completionRate} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-white">
                  {completionRate}%
                </span>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">of all tasks completed</p>
                <p className="text-emerald-600 font-semibold text-lg">{stats?.completedTasks ?? 0} done</p>
              </div>
            </div>
          </div>
          <div className="border-t dark:border-slate-700 pt-4">
            <div className="flex items-center gap-2 text-red-500">
              <HiOutlineExclamation size={18} />
              <span className="text-sm font-medium">{stats?.overdueTasks ?? 0} overdue tasks</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent tasks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-slate-700 dark:text-white mb-4">Recent Tasks</h3>
        {statsLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {(stats?.recentTasks || []).length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No tasks yet. Create your first task!</p>
            ) : (
              stats.recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.status === 'COMPLETED' ? 'bg-emerald-500' :
                      task.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-slate-400'}`} />
                    <span className={`text-sm font-medium truncate ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`badge ${
                      task.priority === 'HIGH' ? 'priority-high' :
                      task.priority === 'MEDIUM' ? 'priority-medium' : 'priority-low'}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(task.dueDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
