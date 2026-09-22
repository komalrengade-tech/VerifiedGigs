import { createContext, useState } from "react";
import { getInitialAuthState, getRoleDashboard } from "./authUtils";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setAuthState({ token: newToken, user: newUser });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ token: null, user: null });
  };

  const value = {
    token: authState.token,
    user: authState.user,
    isAuthenticated: Boolean(authState.token && authState.user),
    isAuthLoading: false,
    login,
    logout,
    getRoleDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

