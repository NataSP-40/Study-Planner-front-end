import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as studyService from "../../services/studyService";
import NoteForm from "../NoteForm/NoteForm";

const NoteEditPage = () => {
  const { subjectId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the subject which contains the note
        const subjectData = await studyService.show(subjectId);
        setSubject(subjectData);
        
        // Find the specific note within the subject
        const foundNote = subjectData.notes.find((n) => n._id === noteId);
        setNote(foundNote);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId, noteId]);

  const handleUpdateNote = async (formData) => {
    try {
      await studyService.updateNote(subjectId, noteId, formData);
      alert("Note updated successfully!");
      // Navigate back to notes list
      navigate("/notes");
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note.");
    }
  };

  const handleCancel = () => {
    navigate("/notes");
  };

  if (loading) {
    return (
      <main style={{ paddingTop: "100px", paddingLeft: "20px" }}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!note) {
    return (
      <main style={{ paddingTop: "100px", paddingLeft: "20px" }}>
        <p>Note not found.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        paddingTop: "100px",
        paddingLeft: "20px",
        paddingRight: "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2>Edit Note</h2>
      <p style={{ color: "#7f8c8d", marginBottom: "20px" }}>
        Subject: {subject?.name}
      </p>
      
      <NoteForm
        onSubmit={handleUpdateNote}
        onCancel={handleCancel}
        initialData={note}
        buttonText="Update Note"
      />
    </main>
  );
};

export default NoteEditPage;
