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
  console.log("subjectId", subjectId);
  const [subject, setSubject] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const { user } = useContext(UserContext);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const navigate = useNavigate();

  // Fetch subject details]

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      const subjectData = await studyService.show(subjectId);
      console.log("subjectData", subjectData);
      setSubject(subjectData);
    };
    fetchSubjectDetails();
  }, [subjectId]);

  // Delete subject handler
  const handleDelete = async () => {
    console.log("=== DELETE DEBUG ===");
    console.log("subjectId from useParams:", subjectId);
    console.log("subject object:", subject);
    console.log("subject._id:", subject?._id);
    console.log("==================");
    try {
      await props.handleDeleteSubject(subjectId);
    } catch (error) {
      console.log("Error deleting subject:", error); // Catch errors specific to this component
    }
  };
  // const handleDelete = async () => {
  //   console.log("Delete button clicked, subject ID:", subjectId);
  //   try {
  //     await props.handleDeleteSubject(subjectId);
  //   } catch (error) {
  //     console.log("Error deleting subject:", error);
  //   }
  // };

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
    <main className={styles.pageContainer}>
      {/* Left: Study Sessions for this subject */}
      <aside className={styles.leftSidebar}>
        <StudySessions subjectId={subjectId} subjects={[subject]} />
      </aside>

      {/* Right: Subject details and notes */}
      <div className={styles.mainContent}>
        {/* Subject details section */}
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

        {/* Notes section */}
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
        </section>
      </div>
    </main>
  );
};

export default SubjectDetails;
