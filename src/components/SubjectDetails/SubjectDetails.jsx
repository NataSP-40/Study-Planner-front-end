import { useState, useEffect } from "react";
import * as studyService from "../../services/studyService";
import { useParams } from "react-router";
import NoteForm from "../NoteForm/NoteForm";

const SubjectDetails = () => {
  const { id } = useParams();
  console.log("subjectId", id);
  const [subject, setSubject] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      const subjectData = await studyService.show(id);
      console.log("subjectData", subjectData);
      setSubject(subjectData);
    };
    fetchSubjectDetails();
  }, [id]);

  const handleAddNote = async (noteFormData) => {
    try {
      const newNote = await studyService.createNote(id, noteFormData);
      // Refresh subject data to show the new note
      const updatedSubject = await studyService.show(id);
      setSubject(updatedSubject);
      setShowNoteForm(false);
    } catch (err) {
      console.log("Error adding note:", err);
    }
  };

  if (!subject) return <main> Loading...</main>;

  return (
    <main>
      <section>
        <header>
          <h1>{subject.name}</h1>
        </header>
        <p>{subject.description}</p>
        <p style={{ fontSize: "0.9rem", color: "#888" }}>
          Created: {new Date(subject.createdAt).toLocaleDateString()}
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Notes</h2>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: showNoteForm ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showNoteForm ? 'Cancel' : '+ Add Note'}
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
            <p>{subject.notes.length} note(s)</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {subject.notes.map((note) => (
                <li key={note._id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#fff'
                }}>
                  <h3>{note.title || "Untitled Note"}</h3>
                  <p>{note.content}</p>
                  <p style={{ fontSize: "0.85rem", color: "#888" }}>
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No notes yet. Click "Add Note" to create your first note!</p>
        )}
      </section>
    </main>
  );
};

export default SubjectDetails;
