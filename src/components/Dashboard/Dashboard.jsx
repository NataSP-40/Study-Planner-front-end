import { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import styles from "./Dashboard.module.css";

import { UserContext } from "../../contexts/UserContext";

import * as userService from "../../services/userService";
import * as studyService from "../../services/studyService";

import SubjectList from "../SubjectList/SubjectList";
import PublicUserList from "../PublicUserList/PublicUserList";
import StudySessions from "../StudySessions/StudySessions";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [usersWithSubjects, setUsersWithSubjects] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        setUsers(fetchedUsers);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await studyService.index();
        setSubjects(fetchedSubjects);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchSubjects();
  }, [user]);

  useEffect(() => {
    const fetchUsersWithSubjects = async () => {
      try {
        const fetchedUsersWithSubjects = await userService.indexWithSubjects();
        // Filter out the current user from the public list
        const otherUsers = fetchedUsersWithSubjects.filter(
          (u) => u._id !== user._id
        );
        setUsersWithSubjects(otherUsers);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchUsersWithSubjects();
  }, [user]);

  return (
    <main className={styles["dashboard-container"]}>
      {/* Left: Study Sessions */}
      <aside className={styles["dashboard-left"]}>
        <StudySessions subjects={subjects} />
      </aside>

      {/* Center: Subject List */}
      <section className={styles["dashboard-center"]}>
        <h1 className={styles["main-title"]}>Welcome, {user.username}</h1>

        <div className={styles["stats-section"]}>
          <div className={styles["section-header"]}>
            <h2>Subject List</h2>
            <Link to="/subjects/new" className={styles["add-subject-btn"]}>
              + Add New Subject
            </Link>
          </div>
          {subjects.length > 0 ? (
            <SubjectList subjects={subjects} />
          ) : (
            <p>
              You haven't created any subjects yet. Start by adding a new
              subject!
            </p>
          )}
        </div>
      </section>

      {/* Right: Public Users */}
      <aside className={styles["dashboard-right"]}>
        <PublicUserList users={usersWithSubjects} />
      </aside>
    </main>
  );
};

export default Dashboard;
