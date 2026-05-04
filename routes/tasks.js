const express = require('express');
const router = express.Router();
const store = require('../data/store');

// CREATE — POST /tasks
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const task = {
    id: store.getNextId(),
    title,
    description: description || '',
    status: 'To Do',
  };
  store.tasks.push(task);
  res.status(201).json(task);
});

// READ ALL — GET /tasks
router.get('/', (req, res) => {
  let result = store.tasks;

  
  if (req.query.status) {
    result = result.filter(t => t.status === req.query.status);
  }

  
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

// READ ONE — GET /tasks/:id
router.get('/:id', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// UPDATE — PUT /tasks/:id
router.put('/:id', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, status } = req.body;
  const validStatuses = ['To Do', 'In Progress', 'Completed'];

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    task.status = status;
  }

  res.json(task);
});

// DELETE — DELETE /tasks/:id
router.delete('/:id', (req, res) => {
  const index = store.tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  store.tasks.splice(index, 1);
  res.json({ message: 'Task deleted' });
});

module.exports = router;