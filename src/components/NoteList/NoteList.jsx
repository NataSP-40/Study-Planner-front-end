const NoteList = ({ notes, handleDeleteNote }) => {
  return (
    <main>
      <h2>Subject Notes</h2>
      {/* Render notes list for the subject */}
      {notes && notes.length > 0 ? (
        notes.map((note) => (
          <div key={note._id} className="note-card">
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            {/* Add more note details here if needed */}
            <button
              onClick={() => {
                /* TODO: Implement edit functionality */
              }}
              style={{
                marginRight: "8px",
                background: "#3498db",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                {
                  handleDeleteNote(note._id);
                }
              }}
              style={{
                background: "#e74c3c",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No notes available.</p>
      )}
    </main>
  );
};

export default NoteList;
