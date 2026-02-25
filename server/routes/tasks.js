const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks - Get all tasks with optional filters
router.get('/', async (req, res) => {
    try {
        const { search, priority, status, category } = req.query;
        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (priority) filter.priority = priority;
        if (status) filter.status = status;
        if (category) filter.category = category;

        const tasks = await Task.find(filter).sort({ order: 1, createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/tasks/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ status: 'completed' });
        const pending = await Task.countDocuments({ status: 'pending' });

        // Weekly data: last 7 days
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const dayName = startOfDay.toLocaleDateString('en-US', { weekday: 'short' });
            const created = await Task.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            });
            const done = await Task.countDocuments({
                status: 'completed',
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
            });

            weekly.push({ day: dayName, created, completed: done });
        }

        // Priority breakdown
        const highCount = await Task.countDocuments({ priority: 'High' });
        const mediumCount = await Task.countDocuments({ priority: 'Medium' });
        const lowCount = await Task.countDocuments({ priority: 'Low' });

        // Category breakdown
        const categories = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
        const categoryStats = await Promise.all(
            categories.map(async (cat) => ({
                name: cat,
                count: await Task.countDocuments({ category: cat }),
            }))
        );

        res.json({
            total,
            completed,
            pending,
            weekly,
            priorityBreakdown: { high: highCount, medium: mediumCount, low: lowCount },
            categoryStats,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/tasks - Create a task
router.post('/', async (req, res) => {
    try {
        const maxOrderTask = await Task.findOne().sort({ order: -1 });
        const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

        const task = new Task({ ...req.body, order });
        const saved = await task.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/tasks/reorder - Update order for drag-and-drop
router.patch('/reorder', async (req, res) => {
    try {
        const { tasks } = req.body; // array of { _id, order }
        const updates = tasks.map(({ _id, order }) =>
            Task.findByIdAndUpdate(_id, { order }, { new: true })
        );
        await Promise.all(updates);
        res.json({ message: 'Tasks reordered' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
