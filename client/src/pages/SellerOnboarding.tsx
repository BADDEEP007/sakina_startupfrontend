import { useState, useRef, useCallback,useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useSeller, type SellerProfile } from "@/contexts/SellerContext";

// ─── Shared style helpers ─────────────────────────────────────────────────────

const S = {
  label: {
    fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
    color: "#3d2b1f", marginBottom: 6, display: "block",
  } as React.CSSProperties,
  input: (focused: boolean, error?: boolean): React.CSSProperties => ({
    width: "100%", fontFamily: "'Poppins',sans-serif", fontSize: 14,
    color: "#3d2b1f", background: focused ? "#fff" : "#fdf4e7",
    border: `1.5px solid ${error ? "#e07a8a" : focused ? "#f4a7b9" : "rgba(196,164,132,0.3)"}`,
    borderRadius: 14, padding: "13px 16px", outline: "none",
    boxShadow: focused ? "0 0 0 3px rgba(244,167,185,0.15)" : "none",
    transition: "all 220ms ease", boxSizing: "border-box",
  }),
  error: {
    fontFamily: "'Poppins',sans-serif", fontSize: 11.5,
    color: "#e07a8a", marginTop: 5,
  } as React.CSSProperties,
};

// ─── InputField ───────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = "text", error }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={S.label}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={S.input(focused, !!error)}
      />
      {error && <p style={S.error}>{error}</p>}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#c4a484", fontWeight: 600 }}>
          Step {step} of {total}
        </span>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#a08070" }}>
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(196,164,132,0.2)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: "linear-gradient(90deg, #f4a7b9, #c4a484)",
          width: `${(step / total) * 100}%`,
          transition: "width 400ms cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i + 1 === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i + 1 <= step
              ? "linear-gradient(90deg, #f4a7b9, #c4a484)"
              : "rgba(196,164,132,0.2)",
            transition: "all 300ms ease",
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Nav buttons ─────────────────────────────────────────────────────────────

function NavButtons({ onBack, onNext, nextLabel = "Continue →", isFirst, isLast, loading }: {
  onBack: () => void; onNext: () => void;
  nextLabel?: string; isFirst: boolean; isLast: boolean; loading?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
      {!isFirst && (
        <button onClick={onBack} style={{
          flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
          color: "#8a6a55", background: "#fff",
          border: "1.5px solid rgba(196,164,132,0.3)", borderRadius: 50,
          padding: "13px", cursor: "pointer", transition: "all 200ms ease",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf4e7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >← Back</button>
      )}
      <button
        onClick={onNext}
        disabled={loading}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flex: 2, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
          color: "#fff",
          background: hov
            ? "linear-gradient(135deg, #e8909f 0%, #b8946a 100%)"
            : "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
          border: "none", borderRadius: 50, padding: "13px", cursor: "pointer",
          boxShadow: hov ? "0 10px 28px rgba(244,167,185,0.45)" : "0 6px 18px rgba(244,167,185,0.28)",
          transform: hov ? "scale(1.02)" : "scale(1)",
          transition: "all 240ms cubic-bezier(0.34,1.56,0.64,1)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Creating…" : nextLabel}
      </button>
    </div>
  );
}

// ─── Step heading ─────────────────────────────────────────────────────────────

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22,
        color: "#3d2b1f", margin: "0 0 6px" }}>{title}</h2>
      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: "#8a6a55", margin: 0 }}>{sub}</p>
    </div>
  );
}

// ─── Work type options ────────────────────────────────────────────────────────

const WORK_TYPES = ["Crochet", "Knitting", "Handmade Accessories", "Fabric Art", "Embroidery", "Other"];

// ─── Data shape ───────────────────────────────────────────────────────────────

interface FormData {
  fullName: string;
  displayName: string;
  avatar: string | null;
  address: string;
  phone: string;
  email: string;
  workTypes: string[];
  otherWork: string;
}

const EMPTY: FormData = {
  fullName: "", displayName: "", avatar: null,
  address: "", phone: "", email: "",
  workTypes: [], otherWork: "",
};

// ─── Main component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

export default function SellerOnboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animating, setAnimating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { isLoggedIn, markAsSeller } = useAuth();
  const { profile, setProfile, openPanel, createSeller, loading: profileLoading } = useSeller();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      setLocation("/login");
    }
  }, [isLoggedIn, setLocation]);

  // Redirect if user is already a seller
  useEffect(() => {
    if (!profileLoading && profile) {
      setLocation("/seller/profile");
    }
  }, [profile, profileLoading, setLocation]);

  // Show loading while checking seller status
  if (profileLoading) {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(160deg, #fdf4e7 0%, #fce8f0 50%, #ede8ff 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      }}>
        <div style={{
          background: "#fff", borderRadius: 28, padding: "40px",
          boxShadow: "0 24px 64px rgba(196,164,132,0.18)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
            Checking seller status...
          </p>
        </div>
      </div>
    );
  }

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (step === 1) {
      if (!data.fullName.trim()) e.fullName = "Full name is required";
      if (!data.displayName.trim()) e.displayName = "Display name is required";
    }
    if (step === 3) {
      if (!data.address.trim()) e.address = "Address is required";
      if (!data.phone.trim()) e.phone = "Phone number is required";
      if (!data.email.trim()) e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Enter a valid email";
    }
    if (step === 4) {
      if (data.workTypes.length === 0) e.workTypes = "Select at least one type";
      if (data.workTypes.includes("Other") && !data.otherWork.trim())
        e.otherWork = "Please describe your work";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goTo = (next: number) => {
    if (animating) return;
    setDirection(next > step ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 220);
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS) goTo(step + 1);
    else handleSubmit();
  };

  const handleBack = () => { if (step > 1) goTo(step - 1); };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createSeller({
        shop_name: data.displayName,
        shop_description: data.otherWork || data.workTypes.join(", "),
        shop_logo: data.avatar || undefined,
      });
      
      markAsSeller();
      setLocation("/seller/profile");
      setTimeout(openPanel, 400);
    } catch (err) {
      console.error("Failed to create seller:", err);
      alert("Failed to create seller profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Image upload ────────────────────────────────────────────────────────────

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => set("avatar", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleWork = (type: string) => {
    const next = data.workTypes.includes(type)
      ? data.workTypes.filter((t) => t !== type)
      : [...data.workTypes, type];
    set("workTypes", next);
    if (errors.workTypes) setErrors((e) => ({ ...e, workTypes: undefined }));
  };

  // ── Slide animation ─────────────────────────────────────────────────────────

  const slideStyle: React.CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction * 40}px)`
      : "translateX(0)",
    transition: "opacity 220ms ease, transform 220ms ease",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #fdf4e7 0%, #fce8f0 50%, #ede8ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Blobs */}
      <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(244,167,185,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(200,182,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 520, background: "#fff", borderRadius: 28,
        padding: "40px 40px 36px",
        boxShadow: "0 24px 64px rgba(196,164,132,0.18), 0 4px 16px rgba(196,164,132,0.08)",
        border: "1px solid rgba(196,164,132,0.12)",
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 14 }}>✦</span>
          </div>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 14, color: "#3d2b1f" }}>
            Become a Seller
          </span>
        </div>

        <Progress step={step} total={TOTAL_STEPS} />

        <div style={slideStyle}>
          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div>
              <StepHead title="Let's start with the basics" sub="Tell us your name so buyers can find you." />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Full Name" value={data.fullName} onChange={(v) => set("fullName", v)}
                  placeholder="Your legal name" error={errors.fullName} />
                <Field label="Display Name" value={data.displayName} onChange={(v) => set("displayName", v)}
                  placeholder="Your shop name (shown to buyers)" error={errors.displayName} />
              </div>
            </div>
          )}

          {/* ── Step 2: Profile Image ── */}
          {step === 2 && (
            <div>
              <StepHead title="Add a profile photo" sub="A friendly face builds trust with buyers." />
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                style={{
                  border: "2px dashed rgba(196,164,132,0.4)", borderRadius: 20,
                  padding: "32px 24px", textAlign: "center", cursor: "pointer",
                  background: "#fdf4e7", transition: "border-color 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#f4a7b9")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(196,164,132,0.4)")}
              >
                {data.avatar ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <img src={data.avatar} alt="Preview"
                      style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover",
                        border: "3px solid #f4a7b9", boxShadow: "0 4px 16px rgba(244,167,185,0.3)" }} />
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#c4a484" }}>
                      Click to change photo
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(244,167,185,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c4a484" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#3d2b1f", margin: 0 }}>
                      Drag & drop or click to upload
                    </p>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#a08070", margin: 0 }}>
                      JPG, PNG or WEBP · Max 5MB
                    </p>
                  </div>
                )}
              </div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#a08070",
                textAlign: "center", marginTop: 12 }}>
                You can skip this and add a photo later.
              </p>
            </div>
          )}

          {/* ── Step 3: Contact Details ── */}
          {step === 3 && (
            <div>
              <StepHead title="Contact details" sub="So buyers and our team can reach you." />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Address" value={data.address} onChange={(v) => set("address", v)}
                  placeholder="Your city or full address" error={errors.address} />
                <Field label="Phone Number" value={data.phone} onChange={(v) => set("phone", v)}
                  placeholder="+1 234 567 8900" type="tel" error={errors.phone} />
                <Field label="Contact Email" value={data.email} onChange={(v) => set("email", v)}
                  placeholder="seller@example.com" type="email" error={errors.email} />
              </div>
            </div>
          )}

          {/* ── Step 4: Type of Work ── */}
          {step === 4 && (
            <div>
              <StepHead title="What do you make?" sub="Select all that apply — buyers will use this to find you." />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                {WORK_TYPES.map((type) => {
                  const active = data.workTypes.includes(type);
                  return (
                    <button key={type} onClick={() => toggleWork(type)} style={{
                      fontFamily: "'Poppins',sans-serif", fontWeight: active ? 700 : 500, fontSize: 13,
                      color: active ? "#fff" : "#7a5c44",
                      background: active ? "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)" : "rgba(245,230,204,0.5)",
                      border: `1.5px solid ${active ? "transparent" : "rgba(196,164,132,0.25)"}`,
                      borderRadius: 50, padding: "9px 20px", cursor: "pointer",
                      boxShadow: active ? "0 4px 12px rgba(244,167,185,0.3)" : "none",
                      transition: "all 220ms cubic-bezier(0.34,1.56,0.64,1)",
                      transform: active ? "scale(1.04)" : "scale(1)",
                    }}>
                      {type}
                    </button>
                  );
                })}
              </div>
              {errors.workTypes && <p style={S.error}>{errors.workTypes}</p>}
              {data.workTypes.includes("Other") && (
                <div style={{ marginTop: 12 }}>
                  <Field label="Describe your work" value={data.otherWork}
                    onChange={(v) => set("otherWork", v)}
                    placeholder="Tell us what you make…" error={errors.otherWork} />
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Review & Submit ── */}
          {step === 5 && (
            <div>
              <StepHead title="Review your profile" sub="Everything look good? Hit create to go live." />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px",
                  background: "#fdf4e7", borderRadius: 16, border: "1px solid rgba(196,164,132,0.15)" }}>
                  {data.avatar ? (
                    <img src={data.avatar} alt="Avatar"
                      style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
                        border: "2px solid #f4a7b9" }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: "50%",
                      background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20 }}>
                        {data.displayName[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16,
                      color: "#3d2b1f", margin: 0 }}>{data.displayName}</p>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#8a6a55", margin: 0 }}>
                      {data.fullName}
                    </p>
                  </div>
                </div>

                {[
                  { label: "Email", value: data.email },
                  { label: "Phone", value: data.phone },
                  { label: "Address", value: data.address },
                  { label: "Craft types", value: data.workTypes.join(", ") || "—" },
                  ...(data.otherWork ? [{ label: "Other work", value: data.otherWork }] : []),
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", gap: 12, padding: "12px 16px",
                    background: "#fff", borderRadius: 12, border: "1px solid rgba(196,164,132,0.12)" }}>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 12.5,
                      color: "#c4a484", minWidth: 100, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#5a4a42" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <NavButtons
          onBack={handleBack} onNext={handleNext}
          nextLabel={step === TOTAL_STEPS ? "Create Seller Profile ✦" : "Continue →"}
          isFirst={step === 1} isLast={step === TOTAL_STEPS}
          loading={loading}
        />
      </div>
    </div>
  );
}
