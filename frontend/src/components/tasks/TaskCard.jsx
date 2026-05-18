import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi';
import useTaskStore from '../../store/useTaskStore';
import { formatDate, isOverdue } from '../../utils/formatDate';

const PRIORITY_CLASS = { HIGH: 'priority-high', MEDIUM: 'priority-medium', LOW: 'priority-low' };
const STATUS_CLASS   = { PENDING: 'status-pending', IN_PROGRESS: 'status-in_progress', COMPLETED: 'status-completed' };
const STATUS_LABELS  = { PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };

export default function TaskCard({ task, onEdit }) {
  const { updateTask, deleteTask } = useTaskStore();

  const markComplete = (e) => {
    e.stopPropagation();
    if (task.status !== 'COMPLETED') {
      updateTask(task.id, { ...task, status: 'COMPLETED', dueDate: task.dueDate?.split('T')[0] });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      onClick={onEdit}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md cursor-pointer
                 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800
                 transition-all duration-200 group"
    >
      {/* Top row: priority badge + actions */}
      <div className="flex items-start justify-between mb-3">
        <span className={`badge ${PRIORITY_CLASS[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== 'COMPLETED' && (
            <button onClick={markComplete}
              className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-500 transition-colors"
              title="Mark complete">
              <HiOutlineCheckCircle size={16} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500 transition-colors"
            title="Edit">
            <HiOutlinePencil size={16} />
          </button>
          <button onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
            title="Delete">
            <HiOutlineTrash size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-base mb-1.5 leading-tight ${
        task.status === 'COMPLETED'
          ? 'line-through text-slate-400'
          : 'text-slate-800 dark:text-white'}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Status */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t dark:border-slate-700">
        <span className={`badge ${STATUS_CLASS[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            overdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
            <HiOutlineCalendar size={13} />
            {overdue && <span className="text-red-500">Overdue · </span>}
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
