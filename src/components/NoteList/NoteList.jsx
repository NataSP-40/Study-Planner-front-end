const NoteList = (props) => {
  return (
    <main>
      <h2>Subject Notes</h2>
      {/* Render notes list to a specific subject */}
      {props.subjects.map((subject) => (
        <div key={subject._id}>
          <h3>{subject.name}</h3>
          {/* Render notes for this subject */}
        </div>
      ))}
    </main>
  );
};

export default NoteList;
