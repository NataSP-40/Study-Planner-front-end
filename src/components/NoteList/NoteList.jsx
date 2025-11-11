import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import * as studyService from "../../services/studyService";
import style from "./NoteList.module.scss";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNotes = async () => {
      const subjects = await studyService.index();

      const allNotes = [];
      subjects.forEach((subject) => {
        if (subject.notes && subject.notes.length > 0) {
          subject.notes.forEach((note) => {
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
      setNotes(allNotes);
    };
    fetchAllNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleNote = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleDeleteNote = async (subjectId, noteId) => {
    try {
      await studyService.deleteNote(subjectId, noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
      setExpandedNoteId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const goToSubject = (subjectId) => {
    navigate(`/subjects/${subjectId}`);
  };

  return (
    <main className={style.container}>
      <h2>All Notes</h2>
      <input
        type="text"
        placeholder="Search notes by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredNotes && filteredNotes.length > 0 ? (
        filteredNotes.map((note) => {
          const isExpanded = expandedNoteId === note._id;
          return (
            <div
              key={note._id}
              className={`${style.noteCard} ${
                isExpanded ? style.expanded : ""
              }`}
            >
              <div onClick={() => toggleNote(note._id)}>
                <h4>
                  {note.title}
                  <span className={style.arrow}>{isExpanded ? "▼" : "▶"}</span>
                </h4>
                <p className={style.subjectInfo}>
                  Subject: {note.subject?.name || "Unknown Subject"}
                </p>
              </div>
              {isExpanded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={style.expandedContent}
                >
                  <div className={style.contentBox}>
                    <h5>Note Content:</h5>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(note.content),
                      }}
                    />
                  </div>
                  <div className={style.buttonGroup}>
                    <button
                      onClick={() =>
                        navigate(
                          `/subjects/${note.subject._id}/edit-note/${note._id}`
                        )
                      }
                      className={style.editBtn}
                    >
                      ✏️ Edit Note
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteNote(note.subject._id, note._id)
                      }
                      className={style.deleteBtn}
                    >
                      🗑️ Delete Note
                    </button>
                    <button
                      onClick={() => goToSubject(note.subject._id)}
                      className={style.viewBtn}
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
