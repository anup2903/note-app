
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://dummyuser123:dummyuser123@cluster0.lxycyw7.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

// Routes
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Error creating a new note' });
  }
});

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// Get a single note by ID
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the note' });
  }
});

// Update a note by ID
app.put('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const updatedData = req.body;

    
    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    console.log(updatedData);
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the note' });
  }
});


// Delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndRemove(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(deletedNote);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the note' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
