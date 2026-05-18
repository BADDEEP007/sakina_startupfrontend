import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import type { CartItem } from "./CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = "Ordered" | "Packed" | "Shipped" | "Delivered";

export interface Order {
  orderNumber: string;
  date: string;           // ISO
  total: number;
  items: CartItem[];
  status: OrderStatus;
  expectedDelivery: string; // ISO — date + 5 days
}

interface OrdersState {
  orders: Order[];
}

type OrdersAction =
  | { type: "PLACE_ORDER"; order: Order }
  | { type: "HYDRATE"; orders: Order[] };

const LS_KEY = "feedle_orders_v1";

function load(): Order[] {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function save(orders: Order[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(orders)); }
  catch {}
}

function reducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "HYDRATE":      return { orders: action.orders };
    case "PLACE_ORDER":  return { orders: [action.order, ...state.orders] };
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface OrdersContextValue {
  orders: Order[];
  placeOrder: (items: CartItem[], total: number) => Order;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { orders: [] });

  useEffect(() => { dispatch({ type: "HYDRATE", orders: load() }); }, []);
  useEffect(() => { save(state.orders); }, [state.orders]);

  const placeOrder = useCallback((items: CartItem[], total: number): Order => {
    const now = new Date();
    const delivery = new Date(now);
    delivery.setDate(delivery.getDate() + 5);

    const order: Order = {
      orderNumber: `HWL-${Date.now().toString(36).toUpperCase()}`,
      date: now.toISOString(),
      total,
      items,
      status: "Packed",
      expectedDelivery: delivery.toISOString(),
    };
    dispatch({ type: "PLACE_ORDER", order });
    return order;
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({ orders: state.orders, placeOrder }),
    [state.orders, placeOrder]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider");
  return ctx;
}
