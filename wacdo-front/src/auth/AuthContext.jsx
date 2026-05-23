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

        if (!response.data.admin) {
            throw new Error("NOT_ADMIN");
        }

        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
            "user",
            JSON.stringify({
                email: response.data.email,
                admin: response.data.admin
            })
        );

        setIsAuthenticated(true);
    };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };


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