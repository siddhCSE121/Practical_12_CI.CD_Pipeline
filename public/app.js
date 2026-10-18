const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const tasksList = document.getElementById('tasks-list');

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    taskForm.addEventListener('submit', handleCreateTask);
});

async function fetchTasks() {
    try {
        const res = await fetch('/tasks');
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {}
}

function renderTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<li style="color: #888; text-align: center; padding: 10px;">No tasks.</li>';
        return;
    }

    tasksList.innerHTML = tasks.map(t => `
        <li class="task-item">
            <span>${escapeHtml(t.title)}</span>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})">Delete</button>
        </li>
    `).join('');
}

async function handleCreateTask(e) {
    e.preventDefault();
    const title = taskTitle.value.trim();
    if (!title) return;

    try {
        const res = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, completed: false })
        });
        if (res.ok) {
            taskTitle.value = '';
            fetchTasks();
        }
    } catch (err) {}
}

async function deleteTask(id) {
    try {
        await fetch(`/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    } catch (err) {}
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}
