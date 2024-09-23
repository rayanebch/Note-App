const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simuler des notes dans une base de données en mémoire
let notes = [];

// Récupérer toutes les notes
app.get('/notes', (req, res) => {
  res.json(notes);
});

// Ajouter une nouvelle note
app.post('/notes', (req, res) => {
  const newNote = { id: notes.length + 1, ...req.body };
  notes.push(newNote);
  res.json(newNote);
});

// Mettre à jour une note existante
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex((note) => note.id === parseInt(id));
  if (index !== -1) {
    notes[index] = { id: parseInt(id), ...req.body };
    res.json(notes[index]);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

// Supprimer une note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  notes = notes.filter((note) => note.id !== parseInt(id));
  res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
