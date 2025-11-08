import { Link } from "react-router";
import styles from "./SubjectList.module.css";

const SubjectList = (props) => {
  return (
    <main className={styles.container}>
      <div className={styles["top-row"]}>
        <h2>Subject List</h2>
        {/* <Link to="/subjects/new" className={styles["add-subject-btn"]}>
          + Add New Subject
        </Link> */}
      </div>
      {/* Render subject list here */}

      {props.subjects.map((subject) => (
        <Link key={subject._id} to={`/subjects/${subject._id}`}>
          <article>
            <header>
              <h2>{subject.name}</h2>
              <p>
                {`${subject.notes?.length || 0} posted on ${new Date(
                  subject.createdAt
                ).toLocaleDateString()}`}
              </p>
            </header>
            <p>{subject.description}</p>
            <p>{subject.notes?.length || 0} notes</p>
          </article>
        </Link>
      ))}
      {props.subjects.length === 0 && <p>No subjects found.</p>}
    </main>
  );
};

export default SubjectList;
