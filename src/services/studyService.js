const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/subjects`;

const index = async () => {
  try {
    // console.log(BASE_URL);
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const show = async (subjectId) => {
  try {
    const res = await fetch(`${BASE_URL}/${subjectId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const createNote = async (subjectId, noteFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${subjectId}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteFormData),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const createSubject = async (subjectFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subjectFormData),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { index, show, createNote, createSubject };
