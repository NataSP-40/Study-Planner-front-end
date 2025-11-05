import { useState } from "react";

const SubjectForm = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.handleAddSubject(formData);
    console.log("formData", formData);
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Subject Name:</label>
        <input
          required
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description:</label>
        <textarea
          required
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type={"submit"}>Create Subject</button>
      </form>
    </main>
  );
};

export default SubjectForm;
