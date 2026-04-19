import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SellerProfile {
  id: string;
  fullName: string;
  displayName: string;
  avatar: string | null;
  address: string;
  phone: string;
  email: string;
  workTypes: string[];
  otherWork: string;
  createdAt: string;
}

interface SellerState {
  profile: SellerProfile | null;
  panelOpen: boolean;
}

type SellerAction =
  | { type: "SET_PROFILE"; profile: SellerProfile }
  | { type: "OPEN_PANEL" }
  | { type: "CLOSE_PANEL" }
  | { type: "HYDRATE"; profile: SellerProfile | null };

const LS_KEY = "handmade_seller_v1";

function load(): SellerProfile | null {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function save(p: SellerProfile | null) {
  try { p ? localStorage.setItem(LS_KEY, JSON.stringify(p)) : localStorage.removeItem(LS_KEY); }
  catch {}
}

function reducer(state: SellerState, action: SellerAction): SellerState {
  switch (action.type) {
    case "HYDRATE":     return { ...state, profile: action.profile };
    case "SET_PROFILE": return { ...state, profile: action.profile };
    case "OPEN_PANEL":  return { ...state, panelOpen: true };
    case "CLOSE_PANEL": return { ...state, panelOpen: false };
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface SellerContextValue {
  profile: SellerProfile | null;
  panelOpen: boolean;
  setProfile: (p: SellerProfile) => void;
  openPanel: () => void;
  closePanel: () => void;
}

const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { profile: null, panelOpen: false });

  useEffect(() => { dispatch({ type: "HYDRATE", profile: load() }); }, []);
  useEffect(() => { save(state.profile); }, [state.profile]);

  const setProfile = useCallback((p: SellerProfile) => dispatch({ type: "SET_PROFILE", profile: p }), []);
  const openPanel  = useCallback(() => dispatch({ type: "OPEN_PANEL" }), []);
  const closePanel = useCallback(() => dispatch({ type: "CLOSE_PANEL" }), []);

  const value = useMemo<SellerContextValue>(() => ({
    profile: state.profile, panelOpen: state.panelOpen,
    setProfile, openPanel, closePanel,
  }), [state, setProfile, openPanel, closePanel]);

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be inside SellerProvider");
  return ctx;
}
