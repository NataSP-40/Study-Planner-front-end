import { createContext, useState } from "react";

const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1]));
};

function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken());
  const [subjects, setSubjects] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser, subjects, setSubjects }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
