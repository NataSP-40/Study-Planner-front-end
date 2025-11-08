import { useEffect, useState } from "react";
import styles from "./StudySessionForm.module.css";
import * as studyService from "../../services/studyService";

const StudySessionForm = ({ initial, subjectId, onSaved, onCancel }) => {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Format the initial date if exists
  const formatDate = (dateString) => {
    if (!dateString) return defaultDate;
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 2) Prefill when editing (no helpers, all inline)
  const [date, setDate] = useState(formatDate(initial?.date));
  const [title, setTitle] = useState(initial?.title || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [status, setStatus] = useState(initial?.status || "planned");
  const [error, setError] = useState("");

  const isEditing = Boolean(initial && (initial._id || initial.id));

  function isValid() {
    if (!subjectId) return false;
    if (!date) return false;
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValid()) {
      setError(
        "Please fill all fields and make sure end time is after start time."
      );
      return;
    }

    const payload = {
      subjectId,
      date,
      title: title.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
    };

    try {
      let saved;
      if (isEditing) {
        saved = await studyService.updateSession(
          initial._id || initial.id,
          payload
        );
      } else {
        saved = await studyService.createSession(payload);
      }
      onSaved && onSaved(saved);
    } catch (err) {
      console.log(err);
      setError("Unable to save session. Please try again.");
    }
  }

  return (
    <main className={styles.container}>
      <h2 className={styles.title}>
        {isEditing ? "Edit Study Session" : "Plan Study Session"}
      </h2>
      {!subjectId && (
        <p className={styles.error}>
          This form needs a subjectId prop. Pass it from the parent.
        </p>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles["form-group"]}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="title">Title (optional)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chapter 3 practice"
            maxLength={120}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything to remember for this session..."
            rows={3}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="planned">planned</option>
            <option value="completed">completed</option>
            <option value="canceled">canceled</option>
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles["secondary-btn"]}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles["primary-btn"]}
            disabled={!isValid()}
          >
            {isEditing ? "Save Changes" : "Create Session"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default StudySessionForm;
