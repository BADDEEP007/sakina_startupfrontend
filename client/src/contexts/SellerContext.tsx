import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { sellersApi } from "@/lib/api";

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
  loading: boolean;
  error: string | null;
}

type SellerAction =
  | { type: "SET_PROFILE"; profile: SellerProfile | null }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "OPEN_PANEL" }
  | { type: "CLOSE_PANEL" }
  | { type: "HYDRATE"; profile: SellerProfile | null };

function reducer(state: SellerState, action: SellerAction): SellerState {
  switch (action.type) {
    case "HYDRATE":     return { ...state, profile: action.profile };
    case "SET_PROFILE": return { ...state, profile: action.profile, loading: false, error: null };
    case "SET_LOADING": return { ...state, loading: action.loading };
    case "SET_ERROR":   return { ...state, error: action.error, loading: false };
    case "OPEN_PANEL":  return { ...state, panelOpen: true };
    case "CLOSE_PANEL": return { ...state, panelOpen: false };
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface SellerContextValue {
  profile: SellerProfile | null;
  panelOpen: boolean;
  loading: boolean;
  error: string | null;
  setProfile: (p: SellerProfile) => void;
  openPanel: () => void;
  closePanel: () => void;
  refreshProfile: () => Promise<void>;
  createSeller: (data: { shop_name: string; shop_description?: string; shop_logo?: string }) => Promise<void>;
}

const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { 
    profile: null, 
    panelOpen: false,
    loading: false,
    error: null,
  });

  // Fetch seller profile from backend
  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('feedle_token_v1');
    if (!token) {
      dispatch({ type: "SET_PROFILE", profile: null });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "SET_ERROR", error: null });
      
      const response = await sellersApi.getMyProfile();
      
      if (response.seller) {
        const profile: SellerProfile = {
          id: response.seller.id,
          fullName: response.seller.shop_name,
          displayName: response.seller.shop_name,
          avatar: response.seller.shop_logo || null,
          address: "", // Not in backend schema
          phone: "", // Not in backend schema
          email: "", // Not in backend schema
          workTypes: response.seller.shop_description ? [response.seller.shop_description] : [], 
          otherWork: response.seller.shop_description || "",
          createdAt: response.seller.created_at,
        };
        dispatch({ type: "SET_PROFILE", profile });
      } else {
        dispatch({ type: "SET_PROFILE", profile: null });
      }
    } catch (err: any) {
      // If 404 or any error, user is not a seller yet or profile doesn't exist
      console.log("Seller profile not found or error:", err.message);
      dispatch({ type: "SET_PROFILE", profile: null });
      dispatch({ type: "SET_ERROR", error: null }); // Don't show error for missing profile
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const createSeller = useCallback(async (data: { shop_name: string; shop_description?: string; shop_logo?: string }) => {
    try {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "SET_ERROR", error: null });
      
      const response = await sellersApi.create(data);
      
      const profile: SellerProfile = {
        id: response.seller.id,
        fullName: response.seller.shop_name,
        displayName: response.seller.shop_name,
        avatar: response.seller.shop_logo || null,
        address: "",
        phone: "",
        email: "",
        workTypes: [],
        otherWork: "",
        createdAt: response.seller.created_at,
      };
      
      dispatch({ type: "SET_PROFILE", profile });
    } catch (err) {
      console.error("Failed to create seller:", err);
      dispatch({ type: "SET_ERROR", error: "Failed to create seller profile" });
      throw err;
    }
  }, []);

  const setProfile = useCallback((p: SellerProfile) => dispatch({ type: "SET_PROFILE", profile: p }), []);
  const openPanel  = useCallback(() => dispatch({ type: "OPEN_PANEL" }), []);
  const closePanel = useCallback(() => dispatch({ type: "CLOSE_PANEL" }), []);

  const value = useMemo<SellerContextValue>(() => ({
    profile: state.profile, 
    panelOpen: state.panelOpen,
    loading: state.loading,
    error: state.error,
    setProfile, 
    openPanel, 
    closePanel,
    refreshProfile,
    createSeller,
  }), [state, setProfile, openPanel, closePanel, refreshProfile, createSeller]);

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be inside SellerProvider");
  return ctx;
}
