import { useEffect, useState, useContext } from "react";
import styles from "./Dashboard.module.scss";
import { UserContext } from "../../contexts/UserContext";
import * as userService from "../../services/userService";
import SubjectList from "../SubjectList/SubjectList";
import PublicUserList from "../PublicUserList/PublicUserList";
import StudySessions from "../StudySessions/StudySessions";

const Dashboard = ({ subjects }) => {
  const { user } = useContext(UserContext);
  const [usersWithSubjects, setUsersWithSubjects] = useState([]);

  useEffect(() => {
    const fetchUsersWithSubjects = async () => {
      try {
        const fetchedUsersWithSubjects = await userService.indexWithSubjects();
        const otherUsers = fetchedUsersWithSubjects.filter(
          (u) => u._id !== user.payload._id
        );
        setUsersWithSubjects(otherUsers);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) fetchUsersWithSubjects();
  }, [user]);

  return (
    <main className={styles["dashboard-container"]}>
      <aside className={styles["dashboard-left"]}>
        <StudySessions subjects={subjects} />
      </aside>
      <section className={styles["dashboard-center"]}>
        <h1 className={styles["main-title"]}>
          Welcome, {user.payload.username}
        </h1>
        <div className={styles["stats-sectsion"]}>
          <div className={styles["section-header"]}></div>
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
      <aside className={styles["dashboard-right"]}>
        <PublicUserList users={usersWithSubjects} />
      </aside>
    </main>
  );
};

export default Dashboard;
