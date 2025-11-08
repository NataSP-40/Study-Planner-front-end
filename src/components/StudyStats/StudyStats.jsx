const StudyStats = (props) => {
  return (
    <main>
      <h2>Study Statistics</h2>
      {/* Render study statistics here */}
      <p>Total Subjects: {props.subjects.length}</p>
      <p>
        Total Notes:{" "}
        {props.subjects.reduce(
          (acc, subject) => acc + (subject.notes ? subject.notes.length : 0),
          0
        )}
      </p>
      <p>
        Total Study Sessions:{" "}
        {props.subjects.reduce(
          (acc, subject) =>
            acc + (subject.studySessions ? subject.studySessions.length : 0),
          0
        )}{" "}
        hours
      </p>
    </main>
  );
};
export default StudyStats;
