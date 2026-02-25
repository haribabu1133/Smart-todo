const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending',
        },
        category: {
            type: String,
            enum: ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'],
            default: 'Personal',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
