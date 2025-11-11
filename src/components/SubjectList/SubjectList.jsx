import { Link } from "react-router";
import styles from "./SubjectList.module.scss";

const SubjectList = (props) => {
  return (
    <main className={styles.container}>
      <div className={styles["top-row"]}>
        <h2>Subject List</h2>
        <Link to="/subjects/new" className={styles["add-subject-btn"]}>
          + Add New Subject
        </Link>
      </div>
      {props.subjects.map((subject) => {
        const notesCount = subject.notes?.length || 0;
        const sessionsCount = subject.studySessions?.length || 0;

        return (
          <article key={subject._id} className={styles.card}>
            <header>
              <h2>
                <Link to={`/subjects/${subject._id}`}>{subject.name}</Link>
              </h2>
              <p className={styles["date-info"]}>
                Posted on {new Date(subject.createdAt).toLocaleDateString()}
              </p>
            </header>

            <div className={styles["card-content"]}>
              {sessionsCount > 0 && (
                <p className={styles["info-item"]}>
                  <span className={styles.icon}>📅</span>
                  {sessionsCount} study session{sessionsCount !== 1 ? "s" : ""}
                </p>
              )}
              <p className={styles["info-item"]}>
                <span className={styles.icon}>📝</span>
                {notesCount} note{notesCount !== 1 ? "s" : ""}
              </p>
            </div>

            <Link
              to={`/subjects/${subject._id}`}
              className={styles["view-details"]}
            >
              View Details →
            </Link>
          </article>
        );
      })}
      {props.subjects.length === 0 && <p>No subjects found.</p>}
    </main>
  );
};

export default SubjectList;
