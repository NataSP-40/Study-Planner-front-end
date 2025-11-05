import { useState } from 'react';

const NoteForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({ title: '', content: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      border: '1px solid #ccc', 
      padding: '1rem', 
      borderRadius: '8px',
      marginBottom: '1rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Add New Note</h3>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ddd' 
          }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="5"
          style={{ 
            width: '100%', 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ddd',
            resize: 'vertical'
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          type="submit"
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Note
        </button>
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
