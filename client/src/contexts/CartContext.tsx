import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { cartApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItemOptions {
  size?: string;
  color?: string;
  custom?: string;
}

export interface CartItem {
  id: string; // Backend cart item ID
  cartId: string; // unique key: productId + JSON(options)
  product_id: string;
  productId: string; // Alias for compatibility
  name: string;
  image: string;
  images?: string[]; // Backend returns images array
  price: number;
  current_price?: number; // Backend field
  quantity: number;
  selectedOptions: CartItemOptions;
  sellerName: string;
  shop_name?: string; // Backend field
  stock?: number; // Backend field
  is_active?: boolean; // Backend field
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  loading: boolean;
}

type CartAction =
  | { type: "ADD"; payload: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number } }
  | { type: "REMOVE"; cartId: string }
  | { type: "SET_QTY"; cartId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "SET_LOADING"; loading: boolean };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCartId(productId: string, options: CartItemOptions) {
  return `${productId}::${JSON.stringify(options)}`;
}

const LS_KEY = "Feedle_cart_v1";

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

// Transform backend cart item to frontend format
function transformBackendItem(item: any): CartItem {
  return {
    id: item.id,
    cartId: item.id, // Use backend ID as cartId
    product_id: item.product_id,
    productId: item.product_id,
    name: item.name,
    image: item.images?.[0] || "",
    images: item.images || [],
    price: item.current_price || item.price || 0,
    current_price: item.current_price,
    quantity: item.quantity,
    selectedOptions: {},
    sellerName: item.shop_name || "",
    shop_name: item.shop_name,
    stock: item.stock,
    is_active: item.is_active,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };

    case "HYDRATE":
      return { ...state, items: action.items, loading: false };

    case "ADD": {
      const cartId = makeCartId(action.payload.productId, action.payload.selectedOptions);
      const qty = action.payload.quantity ?? 1;
      const existing = state.items.find((i) => i.cartId === cartId);
      const items = existing
        ? state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + qty } : i
          )
        : [...state.items, { ...action.payload, cartId, quantity: qty } as CartItem];
      return { ...state, items };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };

    case "SET_QTY": {
      if (action.quantity < 1) return state;
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId ? { ...i, quantity: action.quantity } : i
        ),
      };
    }

    case "CLEAR":
      return { ...state, items: [] };

    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  drawerOpen: boolean;
  loading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (item: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number }) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  setQuantity: (cartId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    drawerOpen: false,
    loading: false,
  });

  // Fetch cart from backend when user logs in
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('Feedle_token_v1');
    
    if (!user || !token) {
      // If not logged in, load from localStorage
      const saved = loadFromStorage();
      if (saved.length > 0) dispatch({ type: "HYDRATE", items: saved });
      dispatch({ type: "SET_LOADING", loading: false });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", loading: true });
      const response = await cartApi.get();
      
      if (response.success && response.cart) {
        const items = response.cart.items.map(transformBackendItem);
        dispatch({ type: "HYDRATE", items });
      }
    } catch (error: any) {
      console.error("Failed to fetch cart:", error);
      // If it's an auth error, fallback to localStorage silently
      if (error.message?.includes('authorization') || error.message?.includes('401')) {
        const saved = loadFromStorage();
        if (saved.length > 0) dispatch({ type: "HYDRATE", items: saved });
      }
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, [user]);

  // Refresh cart on mount and when user changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Persist to localStorage whenever items change (for non-logged-in users)
  useEffect(() => {
    if (!user) {
      saveToStorage(state.items);
    }
  }, [state.items, user]);

  const addToCart = useCallback(
    async (item: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number }) => {
      const quantity = item.quantity ?? 1;

      if (user) {
        // Add to backend
        try {
          await cartApi.addItem(item.productId, quantity);
          await refreshCart(); // Refresh to get updated cart
          dispatch({ type: "OPEN_DRAWER" });
        } catch (error) {
          console.error("Failed to add to cart:", error);
          throw error;
        }
      } else {
        // Add to local state
        dispatch({ type: "ADD", payload: item });
        dispatch({ type: "OPEN_DRAWER" });
      }
    },
    [user, refreshCart]
  );

  const removeFromCart = useCallback(
    async (cartId: string) => {
      if (user) {
        // Remove from backend
        try {
          await cartApi.removeItem(cartId);
          await refreshCart();
        } catch (error) {
          console.error("Failed to remove from cart:", error);
          throw error;
        }
      } else {
        // Remove from local state
        dispatch({ type: "REMOVE", cartId });
      }
    },
    [user, refreshCart]
  );

  const setQuantity = useCallback(
    async (cartId: string, quantity: number) => {
      if (user) {
        // Update backend
        try {
          await cartApi.updateItem(cartId, quantity);
          await refreshCart();
        } catch (error) {
          console.error("Failed to update quantity:", error);
          throw error;
        }
      } else {
        // Update local state
        dispatch({ type: "SET_QTY", cartId, quantity });
      }
    },
    [user, refreshCart]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      // Clear backend cart
      try {
        await cartApi.clear();
        dispatch({ type: "CLEAR" });
      } catch (error) {
        console.error("Failed to clear cart:", error);
        throw error;
      }
    } else {
      // Clear local state
      dispatch({ type: "CLEAR" });
    }
  }, [user]);

  const openDrawer = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalItems,
      subtotal,
      drawerOpen: state.drawerOpen,
      loading: state.loading,
      openDrawer,
      closeDrawer,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      refreshCart,
    }),
    [state.items, state.drawerOpen, state.loading, totalItems, subtotal,
     openDrawer, closeDrawer, addToCart, removeFromCart, setQuantity, clearCart, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

