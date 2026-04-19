import { memo, useState } from "react";
import { useCart, type CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean; // drawer vs full cart page
}

const CartItem = memo(function CartItem({ item, compact = false }: CartItemProps) {
  const { removeFromCart, setQuantity } = useCart();
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => removeFromCart(item.cartId), 260);
  };

  const optionLabels = [
    item.selectedOptions.size && `Size: ${item.selectedOptions.size}`,
    item.selectedOptions.color && `Color: ${item.selectedOptions.color}`,
    item.selectedOptions.custom && item.selectedOptions.custom,
  ].filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        gap: compact ? 12 : 16,
        padding: compact ? "14px 0" : "18px 0",
        borderBottom: "1px solid rgba(196,164,132,0.12)",
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 260ms ease, transform 260ms ease",
      }}
    >
      {/* Image */}
      <div style={{
        width: compact ? 68 : 88, height: compact ? 68 : 88,
        borderRadius: 14, overflow: "hidden", flexShrink: 0,
        background: "#fdf4e7",
        boxShadow: "0 2px 8px rgba(196,164,132,0.12)",
      }}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700,
          fontSize: compact ? 13 : 14, color: "#3d2b1f",
          margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {item.name}
        </p>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontSize: 11.5,
          color: "#c4a484", margin: 0,
        }}>
          by {item.sellerName}
        </p>
        {optionLabels.length > 0 && (
          <p style={{
            fontFamily: "'Poppins',sans-serif", fontSize: 11,
            color: "#a08070", margin: 0, lineHeight: 1.5,
          }}>
            {optionLabels.join(" · ")}
          </p>
        )}

        {/* Bottom row: qty + price + remove */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto", paddingTop: 6 }}>
          {/* Qty stepper */}
          <div style={{
            display: "flex", alignItems: "center",
            background: "#fdf4e7", borderRadius: 50,
            border: "1px solid rgba(196,164,132,0.2)",
            overflow: "hidden",
          }}>
            <button
              onClick={() => setQuantity(item.cartId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              style={{
                width: 28, height: 28, background: "none", border: "none",
                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                color: item.quantity <= 1 ? "rgba(196,164,132,0.4)" : "#c4a484",
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 150ms",
              }}
            >−</button>
            <span style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700,
              fontSize: 13, color: "#3d2b1f", minWidth: 22, textAlign: "center",
            }}>
              {item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.cartId, item.quantity + 1)}
              style={{
                width: 28, height: 28, background: "none", border: "none",
                cursor: "pointer", color: "#c4a484", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >+</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 800,
              fontSize: compact ? 14 : 15, color: "#d4856a",
            }}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={handleRemove}
              aria-label="Remove item"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(196,164,132,0.6)", padding: 4,
                display: "flex", alignItems: "center",
                transition: "color 180ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e07a8a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,164,132,0.6)")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CartItem;
