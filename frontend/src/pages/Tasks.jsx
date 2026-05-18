import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineFilter, HiOutlineSortAscending } from 'react-icons/hi';
import useTaskStore from '../store/useTaskStore';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';

const STATUS_OPTIONS  = ['', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITY_OPTIONS = ['', 'HIGH', 'MEDIUM', 'LOW'];
const STATUS_LABELS   = { '': 'All Status', PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
const PRIORITY_LABELS = { '': 'All Priority', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

export default function Tasks() {
  const { tasks, loading, filters, setFilters, fetchTasks } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask]  = useState(null);
  const [search, setSearch]      = useState('');

  useEffect(() => { fetchTasks(); }, [filters]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setFilters({ search: e.target.value });
  };

  const openCreate = () => { setEditTask(null); setShowForm(true); };
  const openEdit   = (task) => { setEditTask(task); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditTask(null); };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <motion.button onClick={openCreate} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="btn-primary shadow-lg">
          <HiOutlinePlus size={18} /> New Task
        </motion.button>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={handleSearch} placeholder="Search tasks..."
            className="input pl-9" />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <HiOutlineFilter size={16} className="text-slate-400" />
          <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}
            className="input w-auto pr-8 cursor-pointer">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2">
          <HiOutlineSortAscending size={16} className="text-slate-400" />
          <select value={filters.priority} onChange={(e) => setFilters({ priority: e.target.value })}
            className="input w-auto pr-8 cursor-pointer">
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </select>
        </div>

        {/* Clear */}
        {(filters.status || filters.priority || filters.search) && (
          <button onClick={() => { setFilters({ status: '', priority: '', search: '' }); setSearch(''); }}
            className="text-indigo-500 hover:text-indigo-700 text-sm font-medium transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* Task grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      ) : tasks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-md">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-2">No tasks found</h3>
          <p className="text-slate-400 text-sm mb-6">Create a task or adjust your filters</p>
          <button onClick={openCreate} className="btn-primary">
            <HiOutlinePlus size={16} /> Create Task
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={() => openEdit(task)} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Task form modal */}
      <AnimatePresence>
        {showForm && <TaskForm task={editTask} onClose={closeForm} />}
      </AnimatePresence>
    </div>
  );
}
