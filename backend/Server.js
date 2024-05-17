const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = "mongodb+srv://tradersprofitclub110:tcu443gdVgwYzTgt@dummy.monbdxo.mongodb.net/?retryWrites=true&w=majority&appName=dummy";

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Define a schema for Todo
const todoSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false }
}, { timestamps: true });

// Create a model from the schema
const Todo = mongoose.model('Todo', todoSchema);

// Get all todos
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
    const { text } = req.body;
    const newTodo = new Todo({ text });
    try {
        await newTodo.save();
        res.json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing todo
app.put('/api/todos/:_id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a todo
app.delete('/api/todos/:_id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(deletedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
