import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItemOptions {
  size?: string;
  color?: string;
  custom?: string;
}

export interface CartItem {
  cartId: string; // unique key: productId + JSON(options)
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions: CartItemOptions;
  sellerName: string;
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
}

type CartAction =
  | { type: "ADD"; payload: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number } }
  | { type: "REMOVE"; cartId: string }
  | { type: "SET_QTY"; cartId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCartId(productId: string, options: CartItemOptions) {
  return `${productId}::${JSON.stringify(options)}`;
}

const LS_KEY = "feedle_cart_v1";

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

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };

    case "ADD": {
      const cartId = makeCartId(action.payload.productId, action.payload.selectedOptions);
      const qty = action.payload.quantity ?? 1;
      const existing = state.items.find((i) => i.cartId === cartId);
      const items = existing
        ? state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + qty } : i
          )
        : [...state.items, { ...action.payload, cartId, quantity: qty }];
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
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (item: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number }) => void;
  removeFromCart: (cartId: string) => void;
  setQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    drawerOpen: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.length > 0) dispatch({ type: "HYDRATE", items: saved });
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveToStorage(state.items);
  }, [state.items]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "cartId" | "quantity"> & { quantity?: number }) => {
      dispatch({ type: "ADD", payload: item });
      dispatch({ type: "OPEN_DRAWER" });
    },
    []
  );

  const removeFromCart = useCallback((cartId: string) => {
    dispatch({ type: "REMOVE", cartId });
  }, []);

  const setQuantity = useCallback((cartId: string, quantity: number) => {
    dispatch({ type: "SET_QTY", cartId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
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
      openDrawer,
      closeDrawer,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
    }),
    [state.items, state.drawerOpen, totalItems, subtotal,
     openDrawer, closeDrawer, addToCart, removeFromCart, setQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
