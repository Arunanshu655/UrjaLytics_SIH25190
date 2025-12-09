import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [account, setAccount] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("User");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAccount(parsed);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage, clearing it...");
      localStorage.removeItem("User");
    }
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem("User", JSON.stringify(account));
    } else {
      localStorage.removeItem("User");
    }
  }, [account]);

  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
