/**
 * AuthCard — the white rounded container that wraps the form.
 */
export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: "40px 36px",
        boxShadow:
          "0 20px 60px rgba(196,164,132,0.14), 0 4px 16px rgba(196,164,132,0.08)",
        border: "1px solid rgba(196,164,132,0.12)",
      }}
    >
      {children}
    </div>
  );
}
