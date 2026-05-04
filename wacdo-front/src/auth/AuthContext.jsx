import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
      !!localStorage.getItem("token")
  );

  const login = async (email, motDePasse) => {
    const response = await api.post("/login", {
      email,
      motDePasse,
    });

    localStorage.setItem("token", response.data.token);

    // optionnel mais utile pour navbar
    localStorage.setItem("user", JSON.stringify(response.data.user || { email }));

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  // SAFE PARSE (IMPORTANT)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }

  return (
      <AuthContext.Provider
          value={{
            isAuthenticated,
            login,
            logout,
            user,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}