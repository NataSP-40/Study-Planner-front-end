import { useState, useEffect, useContext } from "react";
import * as studyService from "../../services/studyService";
import { useParams, Link } from "react-router";
import NoteForm from "../NoteForm/NoteForm";
import StudySessionForm from "../StudySessionForm/StudySessionForm";
import { UserContext } from "../../contexts/UserContext";
import styles from "./SubjectDetails.module.css";

const SubjectDetails = (props) => {
  const { subjectId } = useParams();
  console.log("subjectId", subjectId);
  const [subject, setSubject] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessions, setSessions] = useState([]);
  const { user } = useContext(UserContext); // in case we need user info later
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null); // Track which note is being edited
  const [editingSessionId, setEditingSessionId] = useState(null); // Track which session is being edited

  // Fetch subject details]

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      const subjectData = await studyService.show(subjectId);
      console.log("subjectData", subjectData);
      setSubject(subjectData);
    };
    fetchSubjectDetails();
  }, [subjectId]);

  // Fetch sessions for this subject
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const list = await studyService.getSessions(subjectId);
        setSessions(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log("Error fetching sessions:", err);
        setSessions([]);
      }
    };
    fetchSessions();
  }, [subjectId, showSessionForm]);

  // Delete subject handler
  const handleDelete = () => {
    console.log("Delete button clicked, subject ID:", subjectId);
    if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
      props.handleDeleteSubject(subjectId);
    }
  };

  const handleAddNote = async (noteFormData) => {
    try {
      const newNote = await studyService.createNote(subjectId, noteFormData);
      // Refresh subject data to show the new note
      const updatedSubject = await studyService.show(subjectId);
      setSubject(updatedSubject);
      setShowNoteForm(false);
    } catch (err) {
      console.log("Error adding note:", err);
    }
  };

  const handleSessionSaved = async () => {
    setShowSessionForm(false);
    setEditingSessionId(null); // Reset editing state
    try {
      const list = await studyService.getSessions(subjectId);
      setSessions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("Error refreshing sessions:", err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await studyService.deleteSession(sessionId);
      const list = await studyService.getSessions(subjectId);
      setSessions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("Error deleting session:", err);
    }
  };

  // update session handler
  //   const handleUpdateSession = async (sessionId, sessionFormData) => {
  //     try {
  //       await studyService.updateSession(sessionId, sessionFormData);
  //       const list = await studyService.getSessions(subjectId);
  //       setSessions(Array.isArray(list) ? list : []);
  //     } catch (err) {
  //       console.log("Error updating session:", err);
  //     }
  //   };

  // delete Note handler
  const handleDeleteNote = async (noteId) => {
    console.log("Deleting note ID:", noteId);
    console.log("Subject ID:", subjectId);
    if (!noteId) {
      console.error("Note ID is undefined!");
      return;
    }
    try {
      await studyService.deleteNote(subjectId, noteId);
      // Refresh subject data to reflect deleted note
      const updatedSubject = await studyService.show(subjectId);
      setSubject(updatedSubject);
    } catch (err) {
      //   console.log("Error deleting note:", err);
    }
  };

  // update Note handler
  const handleUpdateNote = async (noteId, noteFormData) => {
    if (!noteId) {
      console.error("Note ID is undefined!");
      return;
    }
    try {
      await studyService.updateNote(subjectId, noteId, noteFormData);
      // Refresh subject data to reflect updated note
      const updatedSubject = await studyService.show(subjectId);
      setSubject(updatedSubject);
      setEditingNoteId(null); // Close the edit form
    } catch (err) {
      console.log("Error updating note:", err);
    }
  };

  if (!subject) return <main className={styles.loading}>Loading...</main>;

  console.log("Current user:", user);
  console.log("Subject owner:", subject.owner);
  console.log("Subject data:", subject);

  return (
    <main className={styles.container}>
      {/* Subject details section */}
      <section>
        <header className={styles.header}>
          <h1>{subject.name}</h1>
          {user && (
            <>
              <Link to={`/subjects/${subjectId}/edit`}>
                Edit Subject Details
              </Link>
              <button onClick={handleDelete} className={styles["delete-btn"]}>
                Delete Subject
              </button>
            </>
          )}
        </header>
        <p className={styles.description}>{subject.description}</p>
        <p className={styles["created-date"]}>
          Created: {new Date(subject.createdAt).toLocaleDateString()}
        </p>
      </section>
      {/* // Study Sessions section */}
      <section className={styles["notes-section"]}>
        <div className={styles["notes-header"]}>
          <h2>Study Sessions</h2>
          <button
            onClick={() => {
              setShowSessionForm(!showSessionForm);
              setEditingSessionId(null);
            }}
            className={`${styles["add-note-btn"]} ${
              showSessionForm ? styles.active : styles.inactive
            }`}
          >
            {showSessionForm ? "Cancel" : "+ Plan Session"}
          </button>
        </div>

        {showSessionForm && (
          <StudySessionForm
            subjectId={subjectId}
            initial={
              editingSessionId
                ? sessions.find(
                    (s) =>
                      s._id === editingSessionId || s.id === editingSessionId
                  )
                : null
            }
            onSaved={handleSessionSaved}
            onCancel={() => {
              setShowSessionForm(false);
              setEditingSessionId(null);
            }}
          />
        )}

        {sessions && sessions.length > 0 ? (
          <ul className={styles["notes-list"]}>
            {sessions.map((s) => (
              <li key={s._id || s.id} className={styles["note-item"]}>
                <h3>{s.title || subject.name}</h3>
                <p className={styles["note-content"]}>
                  {s.notes || "No notes"}
                </p>
                <p className={styles["note-date"]}>
                  {s.date ? new Date(s.date).toLocaleDateString() : "No date"}
                  {s.status ? ` · ${s.status}` : ""}
                </p>
                {/* // update session button */}
                <button
                  onClick={() => {
                    setEditingSessionId(s._id || s.id);
                    setShowSessionForm(true);
                  }}
                  className={styles["edit-btn"]}
                  style={{ marginTop: "0.5rem" }}
                >
                  Edit Session
                </button>
                <button
                  onClick={() => handleDeleteSession(s._id || s.id)}
                  className={styles["delete-btn"]}
                  style={{ marginTop: "0.5rem" }}
                >
                  Delete Session
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles["empty-state"]}>
            No sessions planned yet. Click "+ Plan Session" to add one.
          </p>
        )}
      </section>
      {/* // Notes section */}
      <section className={styles["notes-section"]}>
        <div className={styles["notes-header"]}>
          <h2>Notes</h2>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className={`${styles["add-note-btn"]} ${
              showNoteForm ? styles.active : styles.inactive
            }`}
          >
            {showNoteForm ? "Cancel" : "+ Add Note"}
          </button>
        </div>

        {showNoteForm && (
          <NoteForm
            onSubmit={handleAddNote}
            onCancel={() => setShowNoteForm(false)}
          />
        )}

        {subject.notes && subject.notes.length > 0 ? (
          <>
            <p className={styles["notes-count"]}>
              {subject.notes.length} note(s)
            </p>
            <ul className={styles["notes-list"]}>
              {subject.notes.map((note) => {
                console.log("Rendering note:", note);
                return (
                  <li key={note._id} className={styles["note-item"]}>
                    {editingNoteId === note._id ? (
                      // Show edit form if this note is being edited
                      <NoteForm
                        initialData={note}
                        onSubmit={(formData) =>
                          handleUpdateNote(note._id, formData)
                        }
                        onCancel={() => setEditingNoteId(null)}
                        buttonText="Update Note"
                      />
                    ) : (
                      // Show normal note display
                      <>
                        <h3>{note.title || "Untitled Note"}</h3>
                        <p className={styles["note-content"]}>{note.content}</p>
                        <p className={styles["note-date"]}>
                          Created:{" "}
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          <button
                            onClick={() => setEditingNoteId(note._id)}
                            className={styles["edit-btn"]}
                          >
                            Edit Note
                          </button>
                          <button
                            onClick={() => {
                              console.log(
                                "Delete button clicked for note:",
                                note._id
                              );
                              handleDeleteNote(note._id);
                            }}
                            className={styles["delete-btn"]}
                          >
                            Delete Note
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className={styles["empty-state"]}>
            No notes yet. Click "Add Note" to create your first note!
          </p>
        )}
        {/* <NoteList notes={notes} handleDeleteNote={handleDeleteNote} /> */}
      </section>
    </main>
  );
};

export default SubjectDetails;
