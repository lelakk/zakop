import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("zakop_token"));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("zakop_user"));

  const login = (newToken: string, email: string) => {
    localStorage.setItem("zakop_token", newToken);
    localStorage.setItem("zakop_user", email);
    setToken(newToken);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("zakop_token");
    localStorage.removeItem("zakop_user");
    setToken(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
