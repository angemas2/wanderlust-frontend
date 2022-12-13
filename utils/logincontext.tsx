import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext({
  user: { id: "", username: "", signedIn: false },
  login: (name: string) => {},
  logout: () => {},
});

const UserProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  // User is the name of the "data" that gets stored in context
  const [user, setUser] = useState<{
    id: string;
    username: string;
    signedIn: boolean;
  }>({ id: "", username: "", signedIn: false });


 

  // Login updates the user data with a name parameter
  const login = (name: string) => {
    setUser((user) => ({
      id: "",
      username: name,
      signedIn: true,
    }));
  };

  // Logout updates the user data to default
  const logout = () => {
    setUser({
      id: "",
      username: "",
      signedIn: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
