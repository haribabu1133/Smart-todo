import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { FiX } from 'react-icons/fi';
import { taskService } from '../../services/taskService';
import { toast } from 'react-toastify';

const CATEGORIES = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const defaultForm = {
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
    dueDate: null,
};

const TaskModal = ({ task, onClose, onSave }) => {
    const isEdit = Boolean(task?._id);
    const [form, setForm] = useState(isEdit ? {
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        category: task.category || 'Personal',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
    } : { ...defaultForm });
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error('Title is required');
            return;
        }
        setLoading(true);
        try {
            const payload = { ...form, dueDate: form.dueDate || null };
            let data;
            if (isEdit) {
                const res = await taskService.updateTask(task._id, payload);
                data = res.data;
                toast.success('✏️ Task updated!');
            } else {
                const res = await taskService.createTask(payload);
                data = res.data;
                toast.success('✅ Task created!');
            }
            onSave(data, isEdit);
            onClose();
        } catch (err) {
            toast.error('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    className="modal"
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="modal-header">
                        <h2 className="modal-title">{isEdit ? '✏️ Edit Task' : '✨ New Task'}</h2>
                        <button className="icon-btn" onClick={onClose} aria-label="Close modal">
                            <FiX size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="What needs to be done?"
                                value={form.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                autoFocus
                                maxLength={120}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Add some details..."
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                maxLength={500}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    className="form-select"
                                    value={form.priority}
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                >
                                    {PRIORITIES.map(p => (
                                        <option key={p} value={p}>{p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <DatePicker
                                selected={form.dueDate}
                                onChange={(date) => handleChange('dueDate', date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMM d, yyyy h:mm aa"
                                placeholderText="Select due date & time..."
                                isClearable
                                popperPlacement="top-start"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? '...' : isEdit ? 'Update Task' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskModal;
