import { useState } from "react";
import DOMPurify from "dompurify";
import styles from "./PublicUserList.module.scss";

const PublicUserList = ({ users }) => {
  const [expandedUsers, setExpandedUsers] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleUser = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  return (
    <div className={styles.container}>
      <h2>Suggested Users (View Only)</h2>
      {users.length === 0 ? (
        <p className={styles.emptyMessage}>No other users found.</p>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user._id} className={styles.userCard}>
              <div
                onClick={() => toggleUser(user._id)}
                className={styles.userHeader}
              >
                <h3>{user.username}</h3>
                <span>{expandedUsers[user._id] ? "▼" : "▶"}</span>
              </div>
              {expandedUsers[user._id] && (
                <div className={styles.userContent}>
                  {user.subjects && user.subjects.length > 0 ? (
                    user.subjects.map((subject) => (
                      <div key={subject._id} className={styles.subjectCard}>
                        <div
                          onClick={() => toggleSubject(subject._id)}
                          className={styles.subjectHeader}
                        >
                          <div>
                            <h4 className={styles.subjectTitle}>
                              {subject.name}
                            </h4>
                            {subject.description && (
                              <div
                                className={styles.subjectDescription}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    subject.description
                                  ),
                                }}
                              />
                            )}
                            <p className={styles.subjectMeta}>
                              {subject.notes?.length || 0} note(s) | Created:{" "}
                              {new Date(subject.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span>
                            {expandedSubjects[subject._id] ? "▼" : "▶"}
                          </span>
                        </div>
                        {expandedSubjects[subject._id] && (
                          <div className={styles.subjectContent}>
                            <h5>Notes:</h5>
                            {subject.notes && subject.notes.length > 0 ? (
                              <ul className={styles.notesList}>
                                {subject.notes.map((note) => (
                                  <li
                                    key={note._id}
                                    className={styles.noteItem}
                                  >
                                    <p className={styles.noteTitle}>
                                      {note.title || "Untitled Note"}
                                    </p>
                                    <div
                                      className={styles.noteContent}
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                          note.content
                                        ),
                                      }}
                                    />
                                    <p className={styles.noteMeta}>
                                      Created:{" "}
                                      {new Date(
                                        note.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className={styles.noNotes}>No notes yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className={styles.noSubjects}>No subjects yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicUserList;
