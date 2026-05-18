import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const persistAuth = (authToken, authUser) => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
    }

    if (authUser) {
      localStorage.setItem("user", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (token && user) {
      persistAuth(token, user);
    }
  }, [token, user]);

  const signIn = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    persistAuth(authToken, authUser);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    persistAuth(null, null);
  };

  useEffect(() => {
    if (token && !user) {
      setToken(null);
    }
  }, [token, user]);

  const isAuthenticated = Boolean(
    token && token !== "null" && token !== "undefined" && user
  );

  const value = useMemo(
    () => ({ user, token, signIn, signOut, isAuthenticated }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
