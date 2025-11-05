import { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import * as studyService from "./services/studyService";

import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SubjectList from "./components/SubjectList/SubjectList";
import NoteList from "./components/NoteList/NoteList";
import SubjectDetails from "./components/SubjectDetails/SubjectDetails";
import SubjectForm from "./components/SubjectForm/SubjectForm";

import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSubjects = async () => {
      const subjectsData = await studyService.index();
      console.log("subjectsData", subjectsData);
      setSubjects(subjectsData);
    };
    if (user) fetchAllSubjects();
  }, [user]);

  const handleAddSubject = async (subjectFormData) => {
    console.log("subjectFormData", subjectFormData);
    const newSubject = await studyService.createSubject(subjectFormData);
    setSubjects([...subjects, newSubject]);
    navigate("/subjects");
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            <Route
              path="/subjects"
              element={<SubjectList subjects={subjects} />}
            />
            <Route path="/subjects/:id" element={<SubjectDetails />} />
            <Route path="/notes" element={<NoteList subjects={subjects} />} />
            <Route
              path="/subjects/new"
              element={<SubjectForm handleAddSubject={handleAddSubject} />}
            />
          </>
        ) : (
          <>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
