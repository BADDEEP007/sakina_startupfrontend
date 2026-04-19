import { useState } from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12.5,
        color: "#7a5c44", letterSpacing: "0.03em",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#3d2b1f",
            background: focused ? "#fff" : "#fdf4e7",
            border: `1.5px solid ${focused ? "#f4a7b9" : "rgba(196,164,132,0.25)"}`,
            borderRadius: 14,
            padding: isPassword ? "13px 44px 13px 16px" : "13px 16px",
            outline: "none",
            boxShadow: focused ? "0 0 0 3px rgba(244,167,185,0.18)" : "none",
            transition: "all 220ms ease",
            boxSizing: "border-box",
          }}
        />
        {/* Show/hide password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            tabIndex={-1}
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "#c4a484", padding: 0, lineHeight: 1,
            }}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
