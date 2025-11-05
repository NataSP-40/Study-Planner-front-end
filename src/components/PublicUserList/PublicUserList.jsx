import { useState } from 'react';

const PublicUserList = ({ users }) => {
  const [expandedUsers, setExpandedUsers] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleUser = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>All Users' Study Plans (View Only)</h2>
      {users.length === 0 ? (
        <p>No other users found.</p>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user._id} style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              padding: '1rem', 
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9'
            }}>
              <div 
                onClick={() => toggleUser(user._id)}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h3>{user.username}</h3>
                <span>{expandedUsers[user._id] ? '▼' : '▶'}</span>
              </div>

              {expandedUsers[user._id] && (
                <div style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
                  {user.subjects && user.subjects.length > 0 ? (
                    user.subjects.map((subject) => (
                      <div key={subject._id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '4px', 
                        padding: '0.75rem', 
                        marginBottom: '0.75rem',
                        backgroundColor: '#fff'
                      }}>
                        <div 
                          onClick={() => toggleSubject(subject._id)}
                          style={{ 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>{subject.name}</h4>
                            {subject.description && (
                              <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                                {subject.description}
                              </p>
                            )}
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                              {subject.notes?.length || 0} note(s) | Created: {new Date(subject.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span>{expandedSubjects[subject._id] ? '▼' : '▶'}</span>
                        </div>

                        {expandedSubjects[subject._id] && (
                          <div style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
                            <h5>Notes:</h5>
                            {subject.notes && subject.notes.length > 0 ? (
                              <ul style={{ listStyle: 'none', padding: 0 }}>
                                {subject.notes.map((note) => (
                                  <li key={note._id} style={{ 
                                    border: '1px solid #eee', 
                                    borderRadius: '4px', 
                                    padding: '0.5rem', 
                                    marginBottom: '0.5rem',
                                    backgroundColor: '#fafafa'
                                  }}>
                                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>
                                      {note.title || 'Untitled Note'}
                                    </p>
                                    <p style={{ margin: '0', fontSize: '0.9rem' }}>
                                      {note.content}
                                    </p>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                                      Created: {new Date(note.createdAt).toLocaleDateString()}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p style={{ color: '#888', fontSize: '0.9rem' }}>No notes yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>No subjects yet.</p>
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
