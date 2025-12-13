const express = require('express');
const cors = require('cors');
const db = require('./db');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        // Parse tags back to array
        const tasks = rows.map(task => ({
            ...task,
            tags: JSON.parse(task.tags)
        }));
        res.json({ data: tasks });
    });
});

// Create a new task
app.post('/api/tasks', (req, res) => {
    const { title, description, status, tags, dueDate } = req.body;
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const tagsString = JSON.stringify(tags);

    const sql = 'INSERT INTO tasks (id, title, description, status, tags, dueDate, createdAt) VALUES (?,?,?,?,?,?,?)';
    const params = [id, title, description, status, tagsString, dueDate, createdAt];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: { id, title, description, status, tags, dueDate, createdAt }
        });
    });
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const { title, description, status, tags, dueDate } = req.body;
    const tagsString = JSON.stringify(tags);

    // Dynamic update query could be better, but for now we update all or specific fields
    // Let's just update status for drag and drop mostly, but full update is good

    const sql = `UPDATE tasks SET 
    title = COALESCE(?, title), 
    description = COALESCE(?, description), 
    status = COALESCE(?, status), 
    tags = COALESCE(?, tags), 
    dueDate = COALESCE(?, dueDate) 
    WHERE id = ?`;

    const params = [title, description, status, tagsString, dueDate, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'success', changes: this.changes });
    });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', req.params.id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'deleted', changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
