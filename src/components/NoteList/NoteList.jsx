import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import * as studyService from "../../services/studyService";

const NoteList = () => {
  // STATE: Store all notes extracted from all subjects
  const [notes, setNotes] = useState([]);

  // STATE: Store the search term that user types
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const navigate = useNavigate();

  // EFFECT: Fetch all subjects and extract their notes when component first loads
  useEffect(() => {
    const fetchAllNotes = async () => {
      // Step 1: Get all subjects from the backend
      const subjects = await studyService.index();
      console.log("Fetched subjects:", subjects); // For debugging

      // Step 2: Extract notes from all subjects and flatten into one array
      // We also add the subject information to each note
      const allNotes = [];
      subjects.forEach((subject) => {
        if (subject.notes && subject.notes.length > 0) {
          subject.notes.forEach((note) => {
            // Add the subject info to each note for display
            allNotes.push({
              ...note,
              subject: {
                _id: subject._id,
                name: subject.name,
              },
            });
          });
        }
      });

      console.log("Extracted notes:", allNotes); // For debugging
      setNotes(allNotes);
    };
    fetchAllNotes();
  }, []); // Empty array means this runs once when component mounts

  // FILTER: Filter notes based on search term
  // This creates a new array with only notes whose title includes the search term
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleNote = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleDeleteNote = async (subjectId, noteId) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;
    
    try {
      await studyService.deleteNote(subjectId, noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
      setExpandedNoteId(null);
      alert("Note deleted successfully!");
    } catch (err) {
      console.log("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  };

  const goToSubject = (subjectId) => {
    navigate(`/subjects/${subjectId}`);
  };

  return (
    <main
      style={{
        paddingTop: "100px",
        paddingLeft: "20px",
        paddingRight: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2>All Notes</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search notes by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
          border: "2px solid #ddd",
          borderRadius: "8px",
        }}
      />

      {/* NOTES LIST */}
      {filteredNotes && filteredNotes.length > 0 ? (
        filteredNotes.map((note) => {
          const isExpanded = expandedNoteId === note._id;

          return (
            <div
              key={note._id}
              style={{
                border: "2px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                backgroundColor: isExpanded ? "#e3f2fd" : "#f9f9f9",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* COLLAPSED VIEW - Always visible */}
              <div onClick={() => toggleNote(note._id)}>
                <h4 style={{ marginTop: 0, color: "#2c3e50" }}>
                  {note.title}
                  <span style={{ marginLeft: "10px", fontSize: "14px" }}>
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </h4>
                <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "5px 0" }}>
                  Subject: {note.subject?.name || "Unknown Subject"}
                </p>
              </div>

              {/* EXPANDED VIEW - Only shows when note is expanded */}
              {isExpanded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  {/* Full Note Content */}
                  <div
                    style={{
                      padding: "15px",
                      backgroundColor: "white",
                      borderRadius: "4px",
                      marginBottom: "15px",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <h5 style={{ marginTop: 0, color: "#34495e" }}>Note Content:</h5>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(note.content),
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      onClick={() =>
                        navigate(
                          `/subjects/${note.subject._id}/edit-note/${note._id}`
                        )
                      }
                      style={{
                        background: "#3498db",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      ✏️ Edit Note
                    </button>

                    <button
                      onClick={() => handleDeleteNote(note.subject._id, note._id)}
                      style={{
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      🗑️ Delete Note
                    </button>

                    <button
                      onClick={() => goToSubject(note.subject._id)}
                      style={{
                        background: "#27ae60",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      📁 View in Subject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>
          {searchTerm
            ? "No notes found matching your search."
            : "No notes available."}
        </p>
      )}
    </main>
  );
};

export default NoteList;
