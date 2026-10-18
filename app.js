require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for Task Management CI testing
let tasks = [
    { id: 1, title: 'Write GitHub Actions workflow YAML', completed: true },
    { id: 2, title: 'Implement automated test with Jest & Supertest', completed: true },
    { id: 3, title: 'Verify green checkmark on push to main branch', completed: false }
];

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// GET /tasks - Step 2: Fetch all tasks (tested by Jest in CI)
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id - Fetch single task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, task });
});

// POST /tasks - Create task (Supplementary Problem: second automated test)
app.post('/tasks', (req, res) => {
    const { title, completed } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: title.trim(),
        completed: completed || false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }
    tasks.splice(index, 1);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

// Reset tasks helper for isolated test runs
app.resetTasks = function() {
    tasks = [
        { id: 1, title: 'Write GitHub Actions workflow YAML', completed: true },
        { id: 2, title: 'Implement automated test with Jest & Supertest', completed: true }
    ];
};

module.exports = app;
