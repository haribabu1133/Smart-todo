import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiPackage } from 'react-icons/fi';
import { taskService } from '../services/taskService';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import FilterBar from '../components/Tasks/FilterBar';
import { toast } from 'react-toastify';

const EmptyState = ({ message }) => (
    <div className="empty-state">
        <span className="empty-icon"><FiPackage /></span>
        <h3>No tasks found</h3>
        <p>{message || 'Create your first task to get started!'}</p>
    </div>
);

const TasksPage = ({ search = '', category: propCategory }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        priority: '',
        status: '',
        category: propCategory || '',
    });

    const fetchTasks = useCallback(async () => {
        try {
            const { data } = await taskService.getTasks({
                search,
                priority: filters.priority,
                status: filters.status,
                category: filters.category || propCategory,
            });
            setTasks(data);
        } catch {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [search, filters, propCategory]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(fetchTasks, 200); // debounce search
        return () => clearTimeout(timer);
    }, [fetchTasks]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ priority: '', status: '', category: propCategory || '' });
    };

    const handleTaskSaved = (savedTask, isEdit) => {
        if (isEdit) {
            setTasks(prev => prev.map(t => t._id === savedTask._id ? savedTask : t));
        } else {
            setTasks(prev => [savedTask, ...prev]);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    };

    const handleTaskDelete = (deletedId) => {
        setTasks(prev => prev.filter(t => t._id !== deletedId));
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.index === destination.index) return;

        const reordered = Array.from(tasks);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);

        setTasks(reordered);

        try {
            await taskService.reorderTasks(
                reordered.map((t, i) => ({ _id: t._id, order: i }))
            );
        } catch {
            toast.error('Failed to save order');
            fetchTasks();
        }
    };

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const pageTitle = propCategory ? `${propCategory} Tasks` : 'All Tasks';

    return (
        <div className="tasks-page-layout">
            <div className="page-header">
                <div>
                    <h1>{pageTitle}</h1>
                    <p>{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                    id="add-task-btn"
                >
                    <FiPlus size={16} /> Add Task
                </button>
            </div>

            <FilterBar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />

            {loading ? (
                <div className="spinner" />
            ) : tasks.length === 0 ? (
                <EmptyState message={search ? `No tasks matching "${search}"` : 'Add a task above to get started!'} />
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    {pendingTasks.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <div className="section-header">
                                <h3>Pending</h3>
                                <span className="task-count-chip">{pendingTasks.length}</span>
                            </div>
                            <Droppable droppableId="pending">
                                {(provided) => (
                                    <div
                                        className="task-list"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <AnimatePresence>
                                            {pendingTasks.map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.85 : 1,
                                                            }}
                                                        >
                                                            <TaskCard
                                                                task={task}
                                                                onUpdate={handleTaskUpdate}
                                                                onDelete={handleTaskDelete}
                                                                onEdit={handleEdit}
                                                                dragHandleProps={provided.dragHandleProps}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </AnimatePresence>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}

                    {completedTasks.length > 0 && (
                        <div>
                            <div className="section-header">
                                <h3>Completed</h3>
                                <span className="task-count-chip">{completedTasks.length}</span>
                            </div>
                            <Droppable droppableId="completed">
                                {(provided) => (
                                    <div
                                        className="task-list"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <AnimatePresence>
                                            {completedTasks.map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.85 : 1,
                                                            }}
                                                        >
                                                            <TaskCard
                                                                task={task}
                                                                onUpdate={handleTaskUpdate}
                                                                onDelete={handleTaskDelete}
                                                                onEdit={handleEdit}
                                                                dragHandleProps={provided.dragHandleProps}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </AnimatePresence>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}
                </DragDropContext>
            )}

            {showModal && (
                <TaskModal
                    task={editingTask}
                    onClose={closeModal}
                    onSave={handleTaskSaved}
                />
            )}
        </div>
    );
};

export default TasksPage;
