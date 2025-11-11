import { useState, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import style from "./NoteForm.module.scss";

const NoteForm = ({
  onSubmit,
  onCancel,
  initialData,
  buttonText = "Add Note",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
      });
    }
  }, [initialData]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", content: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={style.formContainer}
    >
      <h3>{initialData ? "Edit Note" : "Add New Note"}</h3>
      <div className={style.formGroup}>
        <label
          htmlFor="title"
        >
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={style.formGroup}>
        <label
          htmlFor="content"
        >
          Content:
        </label>
        <RichTextEditor
          id="content"
          name="content"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          placeholder="Write your note here..."
          rows="5"
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            resize: "vertical",
          }}
        />
      </div>
      <div className={style.buttonGroup}>
        <button
          type="submit"
          className={style.submitBtn}
        >
          {buttonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={style.cancelBtn}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
