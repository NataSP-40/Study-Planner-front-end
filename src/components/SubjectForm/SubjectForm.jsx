import { useState, useEffect } from "react";
import styles from "./SubjectForm.module.css";
import { useParams } from "react-router";
import * as studyService from "../../services/studyService";

const SubjectForm = (props) => {
  const { subjectId } = useParams();
  console.log("subjectId", subjectId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchSubject = async () => {
      const subjectData = await studyService.show(subjectId);
      setFormData(subjectData);
    };
    if (subjectId) fetchSubject();
    return () => setFormData({ name: "", description: "" });
  }, [subjectId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (subjectId) {
      props.handleUpdateSubject(subjectId, formData);
    } else {
      props.handleAddSubject(formData);
      console.log("formData", formData);
    }
  };

  return (
    <main className={styles.container}>
      <h1>{subjectId ? "Edit Subject" : "Create Subject"}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles["form-group"]}>
          <label htmlFor="name">Subject Name:</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Mathematics, History, etc."
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="description">Description:</label>
          <textarea
            required
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you'll be studying..."
          />
        </div>
        <button type="submit" className={styles["submit-btn"]}>
          {subjectId ? "Update Subject" : "Create Subject"}
        </button>
      </form>
    </main>
  );
};

export default SubjectForm;
