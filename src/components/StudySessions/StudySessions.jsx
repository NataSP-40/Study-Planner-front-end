import { useState, useEffect } from "react";
import * as studyService from "../../services/studyService";
import StudySessionForm from "../StudySessionForm/StudySessionForm";
import DOMPurify from "dompurify";
import styles from "./StudySessions.module.scss";

const StudySessions = ({ subjectId = null, subjects = [] }) => {
  const [sessions, setSessions] = useState([]);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId);

  // Fetch sessions based on subjectId filter
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const params = selectedSubjectId
          ? { subjectId: selectedSubjectId }
          : {};
        const list = await studyService.getSessions(params);
        setSessions(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log("Error fetching sessions:", err);
        setSessions([]);
      }
    };
    fetchSessions();
  }, [selectedSubjectId, showSessionForm]);

  const handleSessionSaved = async () => {
    setShowSessionForm(false);
    setEditingSessionId(null);
    try {
      const params = selectedSubjectId ? { subjectId: selectedSubjectId } : {};
      const list = await studyService.getSessions(params);
      setSessions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("Error refreshing sessions:", err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await studyService.deleteSession(sessionId);
      const params = selectedSubjectId ? { subjectId: selectedSubjectId } : {};
      const list = await studyService.getSessions(params);
      setSessions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("Error deleting session:", err);
    }
  };

  const getSubjectName = (sessionSubjectId) => {
    const subject = subjects.find((s) => s._id === sessionSubjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  // Calculate stats
  const totalSubjects = subjects.length;
  const totalNotes = subjects.reduce(
    (acc, subject) => acc + (subject.notes ? subject.notes.length : 0),
    0
  );
  const totalSessions = sessions.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Study Sessions</h2>
      </div>

      {/* Stats - only show when viewing all sessions (not filtered to specific subject) */}
      {!subjectId && subjects.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{totalSubjects}</span>
            <span className={styles.statLabel}>Subjects</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{totalNotes}</span>
            <span className={styles.statLabel}>Notes</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{totalSessions}</span>
            <span className={styles.statLabel}>Sessions</span>
          </div>
        </div>
      )}

      {/* Add session button */}
      <button
        onClick={() => {
          setShowSessionForm(!showSessionForm);
          setEditingSessionId(null);
        }}
        className={`${styles["add-session-btn"]} ${
          showSessionForm ? styles.cancel : styles.add
        }`}
      >
        {showSessionForm ? "✕ Cancel" : "+ Plan New Session"}
      </button>

      {/* Subject filter - only show if we have subjects and no specific subjectId */}
      {!subjectId && subjects.length > 0 && (
        <div className={styles.filter}>
          <label htmlFor="subject-filter">Filter by subject:</label>
          <select
            id="subject-filter"
            value={selectedSubjectId || ""}
            onChange={(e) => setSelectedSubjectId(e.target.value || null)}
            className={styles.select}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {showSessionForm && (
        <div className={styles.formContainer}>
          <StudySessionForm
            subjectId={
              selectedSubjectId ||
              (subjects.length > 0 ? subjects[0]._id : null)
            }
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
        </div>
      )}

      <div className={styles.sessionsList}>
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session._id || session.id} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <h3>{session.title || getSubjectName(session.subjectId)}</h3>
                <span
                  className={`${styles.status} ${
                    styles[session.status || "planned"]
                  }`}
                >
                  {session.status || "planned"}
                </span>
              </div>

              {!subjectId && (
                <p className={styles.subjectName}>
                  📚 {getSubjectName(session.subjectId)}
                </p>
              )}

              <p className={styles.date}>
                📅{" "}
                {session.date
                  ? new Date(session.date).toLocaleDateString()
                  : "No date"}
              </p>

              {session.notes && (
                <div
                  className={styles.notes}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(session.notes),
                  }}
                />
              )}

              <div className={styles.actions}>
                <button
                  onClick={() => {
                    setEditingSessionId(session._id || session.id);
                    setShowSessionForm(true);
                  }}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSession(session._id || session.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyState}>
            {showSessionForm
              ? "Save your session to see it here"
              : "No sessions planned yet. Click + to add one."}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudySessions;
