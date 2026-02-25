import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

export const taskService = {
    getTasks: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
        return API.get(`/tasks?${params.toString()}`);
    },

    getStats: () => API.get('/tasks/stats'),

    createTask: (data) => API.post('/tasks', data),

    updateTask: (id, data) => API.put(`/tasks/${id}`, data),

    deleteTask: (id) => API.delete(`/tasks/${id}`),

    reorderTasks: (tasks) => API.patch('/tasks/reorder', { tasks }),
};
