const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/subjects`;
const SESSIONS_BASE_URL = `${
  import.meta.env.VITE_BACK_END_SERVER_URL
}/sessions`;

const index = async () => {
  try {
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

const deleteSubject = async (subjectId) => {
  try {
    const res = await fetch(`${BASE_URL}/${subjectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

async function updateSubject(subjectId, subjectFormData) {
  try {
    const res = await fetch(`${BASE_URL}/${subjectId}`, {
      method: "PUT",
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
}

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

const deleteNote = async (subjectId, noteId) => {
  try {
    const res = await fetch(`${BASE_URL}/${subjectId}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.status === 204) return true;
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateNote = async (subjectId, noteId, noteFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${subjectId}/notes/${noteId}`, {
      method: "PUT",
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

const getSessions = async ({ subjectId, from, to }) => {
  try {
    const params = new URLSearchParams();
    if (subjectId) params.append("subjectId", subjectId);
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const res = await fetch(`${SESSIONS_BASE_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const createSession = async (data) => {
  const { subjectId, date, title, notes, status } = data;
  const payload = { subjectId, date, title, notes, status };
  try {
    const res = await fetch(SESSIONS_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
    }
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateSession = async (sessionId, put) => {
  const { date, title, notes, status } = put;
  const payload = { date, title, notes, status };
  try {
    const res = await fetch(`${SESSIONS_BASE_URL}/${sessionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
    }
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteSession = async (id) => {
  try {
    const res = await fetch(`${SESSIONS_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.status === 204) return true;
    try {
      return await res.json();
    } catch {
      return res.ok;
    }
  } catch (err) {
    console.log(err);
  }
};

export {
  index,
  show,
  createNote,
  deleteNote,
  updateNote,
  createSubject,
  deleteSubject,
  updateSubject,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
};
