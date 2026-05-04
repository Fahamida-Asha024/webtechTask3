const express = require('express');
const app = express();
const taskRoutes = require('./routes/tasks');

app.use(express.json()); 
app.use('/tasks', taskRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));