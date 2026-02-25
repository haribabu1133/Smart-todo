import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { taskService } from '../../services/taskService';
import { toast } from 'react-toastify';

const CATEGORY_EMOJIS = {
    Work: '💼', Personal: '👤', Study: '📚', Health: '🏃', Finance: '💰', Other: '🏷️'
};

const TaskCard = ({ task, onUpdate, onDelete, onEdit, dragHandleProps }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';

    const toggleComplete = async () => {
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            const { data } = await taskService.updateTask(task._id, { status: newStatus });
            onUpdate(data);
            toast.success(newStatus === 'completed' ? '✅ Task completed!' : '🔄 Task reopened');
        } catch {
            toast.error('Failed to update task');
        }
    };

    const handleDelete = async () => {
        try {
            await taskService.deleteTask(task._id);
            onDelete(task._id);
            toast.success('🗑️ Task deleted');
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <motion.div
            className={`task-card priority-${task.priority} ${task.status === 'completed' ? 'completed' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            layout
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
            {dragHandleProps && (
                <div className="drag-handle" {...dragHandleProps}>
                    <MdDragIndicator />
                </div>
            )}

            <div
                className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
                onClick={toggleComplete}
                role="checkbox"
                aria-checked={task.status === 'completed'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleComplete()}
            >
                {task.status === 'completed' && <FaCheck size={9} />}
            </div>

            <div className="task-body">
                <div className={`task-title ${task.status === 'completed' ? 'strikethrough' : ''}`}>
                    {task.title}
                </div>
                {task.description && (
                    <div className="task-description">{task.description}</div>
                )}
                <div className="task-meta">
                    <span className={`badge badge-priority-${task.priority}`}>
                        {task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢'} {task.priority}
                    </span>
                    <span className="badge badge-category">
                        {CATEGORY_EMOJIS[task.category]} {task.category}
                    </span>
                    {task.dueDate && (
                        <span className={`badge badge-due ${isOverdue ? 'overdue' : ''}`}>
                            {isOverdue ? '⚠️' : '📅'} {formatDate(task.dueDate)}
                        </span>
                    )}
                </div>
            </div>

            <div className="task-actions">
                <button className="icon-btn" onClick={() => onEdit(task)} title="Edit task" aria-label="Edit task">
                    <FiEdit2 size={13} />
                </button>
                <button className="icon-btn danger" onClick={handleDelete} title="Delete task" aria-label="Delete task">
                    <FiTrash2 size={13} />
                </button>
            </div>
        </motion.div>
    );
};

export default TaskCard;
