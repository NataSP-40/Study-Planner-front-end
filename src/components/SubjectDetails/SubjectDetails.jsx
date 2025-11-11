import { useState, useEffect, useContext } from "react";
import * as studyService from "../../services/studyService";
import { useParams, Link, useNavigate } from "react-router";
import DOMPurify from "dompurify";
import NoteForm from "../NoteForm/NoteForm";
import StudySessions from "../StudySessions/StudySessions";
import { UserContext } from "../../contexts/UserContext";
import styles from "./SubjectDetails.module.scss";

const SubjectDetails = (props) => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const { user } = useContext(UserContext);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      const subjectData = await studyService.show(subjectId);
      setSubject(subjectData);
    };
    fetchSubjectDetails();
  }, [subjectId]);

  const handleDelete = async () => {
    try {
      await props.handleDeleteSubject(subjectId);
      props.refreshSubjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNote = async (noteFormData) => {
    try {
      await studyService.createNote(subjectId, noteFormData);
      const updatedSubject = await studyService.show(subjectId);
      setSubject(updatedSubject);
      setShowNoteForm(false);
      props.refreshSubjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) {
      return;
    }
    try {
      await studyService.deleteNote(subjectId, noteId);
      const updatedSubject = await studyService.show(subjectId);
      setSubject(updatedSubject);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateNote = async (noteId, noteFormData) => {
    if (!noteId) {
      return;
    }
    try {
      await studyService.updateNote(subjectId, noteId, noteFormData);
      const updatedSubject = await studyService.show(subjectId);
      setSubject(updatedSubject);
      setEditingNoteId(null);
      props.refreshSubjects();
    } catch (error) {
      console.log(error);
    }
  };

  if (!subject) return <main className={styles.loading}>Loading...</main>;

  return (
    <main className={styles.pageContainer}>
      <aside className={styles.leftSidebar}>
        <StudySessions subjectId={subjectId} subjects={[subject]} />
      </aside>
      <div className={styles.mainContent}>
        <section className={styles.subjectSection}>
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
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(subject.description),
            }}
          />
          <p className={styles["created-date"]}>
            Created: {new Date(subject.createdAt).toLocaleDateString()}
          </p>
        </section>
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
                  return (
                    <li key={note._id} className={styles["note-item"]}>
                      {editingNoteId === note._id ? (
                        <NoteForm
                          initialData={note}
                          onSubmit={(formData) =>
                            handleUpdateNote(note._id, formData)
                          }
                          onCancel={() => setEditingNoteId(null)}
                          buttonText="Update Note"
                        />
                      ) : (
                        <>
                          <h3>{note.title || "Untitled Note"}</h3>
                          <div
                            className={styles["note-content"]}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(note.content),
                            }}
                          />
                          <p className={styles["note-date"]}>
                            Created:{" "}
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                          <div className={styles["note-actions"]}>
                            <button
                              onClick={() => setEditingNoteId(note._id)}
                              className={styles["edit-btn"]}
                            >
                              Edit Note
                            </button>
                            <button
                              onClick={() => {
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
        </section>
      </div>
    </main>
  );
};

export default SubjectDetails;
