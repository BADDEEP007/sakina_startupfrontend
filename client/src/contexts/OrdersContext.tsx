import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { ordersApi } from "@/lib/api";
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
  loading: boolean;
  error: string | null;
}

type OrdersAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_ORDERS"; orders: Order[] }
  | { type: "PLACE_ORDER"; order: Order }
  | { type: "HYDRATE"; orders: Order[] };

function reducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "SET_LOADING": return { ...state, loading: action.loading };
    case "SET_ERROR":   return { ...state, error: action.error };
    case "SET_ORDERS":  return { ...state, orders: action.orders, loading: false, error: null };
    case "HYDRATE":     return { ...state, orders: action.orders };
    case "PLACE_ORDER": return { ...state, orders: [action.order, ...state.orders] };
    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface OrdersContextValue {
  orders: Order[];
  loading: boolean;
  error: string | null;
  placeOrder: (addressId: string, paymentMethod: string, notes?: string) => Promise<Order>;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { orders: [], loading: false, error: null });

  // Fetch orders from backend
  const refreshOrders = useCallback(async () => {
    const token = localStorage.getItem('handmade_token_v1');
    if (!token) {
      dispatch({ type: "SET_ORDERS", orders: [] });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "SET_ERROR", error: null });
      const response = await ordersApi.getAll();
      
      // Transform backend orders to match frontend Order interface
      const transformedOrders: Order[] = (response.orders || []).map((order: any) => ({
        orderNumber: order.order_number || order.id,
        date: order.created_at,
        total: parseFloat(order.total_amount || 0),
        items: order.items || [],
        status: mapBackendStatus(order.status),
        expectedDelivery: order.expected_delivery || calculateDeliveryDate(order.created_at),
      }));
      
      dispatch({ type: "SET_ORDERS", orders: transformedOrders });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      dispatch({ type: "SET_ERROR", error: "Failed to load orders" });
      dispatch({ type: "SET_ORDERS", orders: [] });
    }
  }, []);

  // Load orders on mount
  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const placeOrder = useCallback(async (addressId: string, paymentMethod: string, notes?: string): Promise<Order> => {
    try {
      const response = await ordersApi.create({
        address_id: addressId,
        payment_method: paymentMethod,
        notes,
      });

      const order: Order = {
        orderNumber: response.order.order_number || response.order.id,
        date: response.order.created_at,
        total: parseFloat(response.order.total_amount || 0),
        items: response.order.items || [],
        status: mapBackendStatus(response.order.status),
        expectedDelivery: response.order.expected_delivery || calculateDeliveryDate(response.order.created_at),
      };

      dispatch({ type: "PLACE_ORDER", order });
      return order;
    } catch (err) {
      console.error("Failed to place order:", err);
      throw err;
    }
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({ 
      orders: state.orders, 
      loading: state.loading,
      error: state.error,
      placeOrder,
      refreshOrders,
    }),
    [state.orders, state.loading, state.error, placeOrder, refreshOrders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

// Helper function to map backend status to frontend status
function mapBackendStatus(backendStatus: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'pending': 'Ordered',
    'processing': 'Packed',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Ordered', // Fallback
  };
  return statusMap[backendStatus] || 'Ordered';
}

// Helper function to calculate delivery date (5 days from order date)
function calculateDeliveryDate(orderDate: string): string {
  const date = new Date(orderDate);
  date.setDate(date.getDate() + 5);
  return date.toISOString();
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider");
  return ctx;
}
