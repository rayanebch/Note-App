import { useState, useEffect } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/notes");
        const notesFromDB = await response.json();
        setNotes(notesFromDB);
      } catch (error) {
        console.error("Erreur lors du chargement des notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async (event) => {
    event.preventDefault();
    const newNote = { title, content, color };

    try {
      const response = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      const addedNote = await response.json();
      setNotes([addedNote, ...notes]);
      setTitle("");
      setContent("");
      setColor("#FFFFFF");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erreur lors de l’ajout de la note:", error);
    }
  };

  const handleUpdateNote = async (event) => {
    event.preventDefault();
    if (!selectedNote) return;

    const updatedNote = { title, content, color };

    try {
      const response = await fetch(
        `http://localhost:5000/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedNote),
        }
      );
      const updatedNoteFromDB = await response.json();
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNoteFromDB : note
      );
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setColor("#FFFFFF");
      setSelectedNote(null);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Erreur lors de la modification de la note:", error);
    }
  };

  const deleteNote = async (event, noteId) => {
    event.stopPropagation();
    try {
      await fetch(`http://localhost:5000/notes/${noteId}`, {
        method: "DELETE",
      });
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setColor("#FFFFFF");
    setSelectedNote(null);
    setIsFormVisible(false);
  };


  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container flex flex-col p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-black italic">NOTES</h1>
        <button
          onClick={() => {
            setSelectedNote(null);
            setTitle("");
            setContent("");
            setColor("#FFFFFF");
            setIsFormVisible(true);
          }}
          className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl"
        >
          +
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher des notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {isFormVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <form
            onSubmit={selectedNote ? handleUpdateNote : handleAddNote}
            className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col"
          >
            <h2 className="text-lg font-bold mb-4 text-center">
              {selectedNote ? "Modifier la note" : "Ajouter une note"}
            </h2>
            <input
              type="text"
              placeholder="Titre de la note"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              placeholder="Contenu de la note"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded resize-none"
              rows="4"
              required
            />
            <div className="flex items-center mb-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
              <span className="ml-2">{color}</span>
            </div>
            <button
              type="submit"
              className="bg-gray-400 text-white p-2 rounded w-full"
              style={{
                backgroundColor:
                  selectedNote || color !== "#FFFFFF" ? color : "#CCCCCC",
              }}
            >
              {selectedNote ? "Modifier" : "Ajouter"}
            </button>
            <div className="flex justify-between mt-4 space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white p-2 rounded w-full"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-">
        {filteredNotes.map((note) => (
          <div
            onClick={() => handleNoteClick(note)}
            className="note-item p-4 rounded-lg shadow-md text-black relative cursor-pointer font-roboto"
            key={note.id}
            style={{
              backgroundColor: note.color,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            <h2 className="text-lg font-semibold font-roboto">{note.title || `Note ${note.id}`}</h2>
            <p className="mt-2 text-sm">{note.content || "Contenu"}</p>
            <button
              onClick={(event) => deleteNote(event, note.id)}
              className="absolute top-2 right-2 text-black"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
