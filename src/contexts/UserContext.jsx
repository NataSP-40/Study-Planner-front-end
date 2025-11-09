import { createContext, useState } from "react";

const UserContext = createContext();

const getUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const decoded = JSON.parse(atob(token.split(".")[1]));
  console.log("Decoded user from token:", decoded);
  return decoded;
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
