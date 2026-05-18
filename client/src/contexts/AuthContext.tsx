import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isSeller: boolean;
  hasPassword?: boolean;
  /** Only relevant for email/password accounts — always true for Google */
  emailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: "HYDRATE"; user: User | null; token: string | null }
  | { type: "LOGIN";   user: User; token: string }
  | { type: "LOGOUT" }
  | { type: "SET_SELLER" }
  | { type: "UPDATE_USER"; partial: Partial<User> };

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_USER  = "Feedle_auth_v1";
const LS_TOKEN = "Feedle_token_v1";

function loadSession(): { user: User | null; token: string | null } {
  try {
    const user  = localStorage.getItem(LS_USER);
    const token = localStorage.getItem(LS_TOKEN);
    return {
      user:  user  ? (JSON.parse(user) as User) : null,
      token: token ?? null,
    };
  } catch {
    return { user: null, token: null };
  }
}

function saveSession(user: User | null, token: string | null) {
  try {
    if (user)  localStorage.setItem(LS_USER,  JSON.stringify(user));
    else       localStorage.removeItem(LS_USER);
    if (token) localStorage.setItem(LS_TOKEN, token);
    else       localStorage.removeItem(LS_TOKEN);
  } catch {}
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "HYDRATE":
      return { user: action.user, token: action.token, isLoading: false };
    case "LOGIN":
      return { ...state, user: action.user, token: action.token };
    case "LOGOUT":
      return { ...state, user: null, token: null };
    case "SET_SELLER":
      return state.user
        ? { ...state, user: { ...state.user, isSeller: true } }
        : state;
    case "UPDATE_USER":
      return state.user
        ? { ...state, user: { ...state.user, ...action.partial } }
        : state;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isSeller: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  markAsSeller: () => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null, token: null, isLoading: true,
  });

  // Hydrate from localStorage — runs before first paint to prevent flicker
  useEffect(() => {
    const { user, token } = loadSession();
    dispatch({ type: "HYDRATE", user, token });
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!state.isLoading) saveSession(state.user, state.token);
  }, [state.user, state.token, state.isLoading]);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
  }, []);

  const login = useCallback(
    (user: User, token: string) => dispatch({ type: "LOGIN", user, token }),
    []
  );
  const markAsSeller = useCallback(() => dispatch({ type: "SET_SELLER" }), []);
  const updateUser   = useCallback(
    (partial: Partial<User>) => dispatch({ type: "UPDATE_USER", partial }),
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      isLoggedIn: !!state.user,
      isSeller: !!state.user?.isSeller,
      isLoading: state.isLoading,
      login, logout, markAsSeller, updateUser,
    }),
    [state, login, logout, markAsSeller, updateUser]
  );

  // Block render until hydration completes — prevents navbar flicker
  if (state.isLoading) {
    return (
      <AuthContext.Provider value={value}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
