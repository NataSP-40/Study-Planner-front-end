import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as studyService from "../../services/studyService";
import NoteForm from "../NoteForm/NoteForm";
import style from "./NoteEditPage.module.scss";

const NoteEditPage = () => {
  const { subjectId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectData = await studyService.show(subjectId);
        setSubject(subjectData);
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
      navigate("/notes");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/notes");
  };

  if (loading) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  if (!note) {
    return (
      <main>
        <p>Note not found.</p>
      </main>
    );
  }

  return (
    <main className={style.container}>
      <h2>Edit Note</h2>
      <p className={style.subjectName}>
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
