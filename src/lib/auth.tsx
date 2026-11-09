import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { setProjectOwner } from "./projects";
export type AccountUser = { id: string; email: string; name: string };
type AuthContextValue = {
  user: AccountUser | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
async function accountRequest(action: string, body?: Record<string, string>) {
  let response: Response;
  try {
    response = await fetch(`/api/auth/${action}`, {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("We couldn’t reach the account service. Please try again.");
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The account service is unavailable. Please try again shortly.",
    );
  }
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data as { user?: AccountUser | null; success?: boolean };
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    accountRequest("session")
      .then((data) => {
        if (active) {
          setProjectOwner(data.user?.id || null);
          setUser(data.user || null);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const check = () => {
      if (document.visibilityState !== "visible") return;
      accountRequest("session")
        .then((data) => {
          setProjectOwner(data.user?.id || null);
          setUser(data.user || null);
        })
        .catch(() => {});
    };
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, []);
  const login = async (email: string, password: string) => {
    const data = await accountRequest("login", { email, password });
    if (!data.user) throw new Error("Couldn’t sign in. Please try again.");
    setProjectOwner(data.user.id);
    setUser(data.user);
    setError("");
  };
  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    await accountRequest("signup", { name, email, password, confirmPassword });
    setError("");
  };
  const logout = async () => {
    await accountRequest("logout", {});
    setProjectOwner(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is required.");
  return context;
}
